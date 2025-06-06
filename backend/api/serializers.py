from rest_framework import serializers

class RepoAnalysisSerializer(serializers.Serializer):
    repo_url = serializers.URLField(required=True)
    
    def validate_repo_url(self, value):
        if 'github.com' not in value:
            raise serializers.ValidationError("Please provide a valid GitHub repository URL")
        return value
