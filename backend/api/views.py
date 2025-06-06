import requests
from datetime import datetime, timedelta
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from .serializers import RepoAnalysisSerializer
from collections import deque
from django.core.cache import cache
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from collections import deque
from django.http import JsonResponse
import json
import time


# Simple in-memory storage for search history
search_history = deque(maxlen=10)  # Store last 10 searches

@api_view(['GET'])
def get_search_history(request):
    return Response(list(search_history))

@api_view(['POST'])
@csrf_exempt
def add_to_history(request):
    try:
        data = json.loads(request.body)
        repo_url = data.get('repo_url')
        if repo_url:
            # Add to the beginning of the deque if not already present
            if repo_url in search_history:
                search_history.remove(repo_url)
            search_history.appendleft(repo_url)
        return Response({'status': 'success'})
    except json.JSONDecodeError:
        return Response({'error': 'Invalid JSON'}, status=400)


class GitHubRepoAnalysisView(APIView):
    permission_classes = [AllowAny]
    
    def get_github_headers(self):
        headers = {
            'Accept': 'application/vnd.github.v3+json'
        }
        if settings.GITHUB_TOKEN:
            headers['Authorization'] = f'token {settings.GITHUB_TOKEN}'
        return headers
    
    def extract_owner_repo(self, repo_url):
        # Extract owner and repo name from URL
        parts = repo_url.rstrip('/').split('/')
        owner = parts[-2]
        repo = parts[-1]
        return owner, repo
    
    def get_repo_data(self, owner, repo):
        url = f"{settings.GITHUB_API_URL}/repos/{owner}/{repo}"
        response = requests.get(url, headers=self.get_github_headers())
        response.raise_for_status()
        return response.json()
    
    def get_contributors(self, owner, repo):
        contributors = []
        page = 1

        while True:
            url = f"{settings.GITHUB_API_URL}/repos/{owner}/{repo}/contributors"
            params = {'per_page': 100, 'page': page}
            response = requests.get(url, headers=self.get_github_headers(), params=params)

            if response.status_code == 204 or not response.json():
                break

            response.raise_for_status()
            data = response.json()
            contributors.extend(data)

            if len(data) < 100:
                break  # No more pages

            page += 1

        return contributors
    
    def get_commit_activity(self, owner, repo):
        # Get commit activity for the last year
        url = f"{settings.GITHUB_API_URL}/repos/{owner}/{repo}/stats/commit_activity"
        headers = self.get_github_headers()
        
        for _ in range(5):  # Retry up to 5 times
            response = requests.get(url, headers=headers)
            
            if response.status_code == 202:
                # GitHub is computing the stats; wait and retry
                time.sleep(2)
                continue
            
            response.raise_for_status()
            return response.json()
        
        return []
    
    def analyze_commit_activity(self, commit_activity):
        if not commit_activity:
            return {
                'total_commits': 0,
                'avg_commits_per_week': 0,
                'most_active_day': None,
                'most_commits_in_week': 0
            }
            
        total_commits = sum(week['total'] for week in commit_activity)
        avg_commits = total_commits / len(commit_activity) if commit_activity else 0
        
        # Find the week with most commits
        most_commits_week = max(commit_activity, key=lambda x: x['total'])
        
        # Find the day with most commits (0 = Sunday, 1 = Monday, etc.)
        day_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        most_active_day_index = most_commits_week['days'].index(max(most_commits_week['days']))
        most_active_day = day_names[most_active_day_index]
        
        return {
            'total_commits': total_commits,
            'avg_commits_per_week': round(avg_commits, 2),
            'most_active_day': most_active_day,
            'most_commits_in_week': most_commits_week['total']
        }

    def get_open_issues_count(self, owner, repo):
        url = f"{settings.GITHUB_API_URL}/search/issues"
        params = {
            'q': f'repo:{owner}/{repo} is:issue is:open'
        }
        response = requests.get(url, headers=self.get_github_headers(), params=params)
        response.raise_for_status()
        return response.json().get('total_count', 0)
    
    def get_open_prs_count(self, owner, repo):
        url = f"{settings.GITHUB_API_URL}/search/issues"
        params = {
            'q': f'repo:{owner}/{repo} is:pr is:open'
        }
        response = requests.get(url, headers=self.get_github_headers(), params=params)
        response.raise_for_status()
        return response.json().get('total_count', 0)

    def get_branch_count(self, owner, repo):
        branches = []
        page = 1

        while True:
            url = f"{settings.GITHUB_API_URL}/repos/{owner}/{repo}/branches"
            params = {'per_page': 100, 'page': page}
            response = requests.get(url, headers=self.get_github_headers(), params=params)
            response.raise_for_status()
            data = response.json()

            branches.extend(data)

            if len(data) < 100:
                break  # No more pages

            page += 1

        return len(branches)
    
    
    def post(self, request):
        serializer = RepoAnalysisSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        repo_url = serializer.validated_data['repo_url']
        
        try:
            # Extract owner and repo from URL
            owner, repo = self.extract_owner_repo(repo_url)
            
            # Get repository data
            repo_data = self.get_repo_data(owner, repo)
            
            # Get contributors
            contributors = self.get_contributors(owner, repo)
            
            # Get commit activity
            commit_activity = self.get_commit_activity(owner, repo)
            
            # Analyze commit activity
            commit_analysis = self.analyze_commit_activity(commit_activity)
            
            print("Commit Activity:\n", commit_analysis)
            open_issues = self.get_open_issues_count(owner, repo)
            open_prs = self.get_open_prs_count(owner, repo)
            branch_count = self.get_branch_count(owner, repo)

            # Prepare response
            response_data = {
                'name': repo_data.get('name'),
                'full_name': repo_data.get('full_name'),
                'description': repo_data.get('description'),
                'html_url': repo_data.get('html_url'),
                'stargazers_count': repo_data.get('stargazers_count'),
                'forks_count': repo_data.get('forks_count'),
                'open_issues_count': open_issues,
                'open_prs_count': open_prs,
                'branch_count': branch_count,
                'subscribers_count': repo_data.get('subscribers_count'),
                'created_at': repo_data.get('created_at'),
                'updated_at': repo_data.get('updated_at'),
                'language': repo_data.get('language'),
                'contributors_count': len(contributors) if contributors else 0,
                'top_contributors': [
                    {
                        'login': c.get('login'),
                        'contributions': c.get('contributions'),
                        'html_url': c.get('html_url'),
                        'avatar_url': c.get('avatar_url')
                    } for c in contributors[:10]  # Top 5 contributors
                ] if contributors else [],
                'commit_activity': commit_analysis,
                'commit_ac':commit_activity,
            }
            
            return Response(response_data)
            
        except requests.exceptions.HTTPError as e:
            error_message = f"GitHub API error: {str(e)}"
            if e.response.status_code == 404:
                error_message = "Repository not found. Please check the URL and try again."
            elif e.response.status_code == 403:
                error_message = "API rate limit exceeded. Please try again later or add a GitHub token for higher limits."
            return Response(
                {'error': error_message},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
