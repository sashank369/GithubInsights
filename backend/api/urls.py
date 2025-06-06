from django.urls import path
from . import views

urlpatterns = [
    path('analyze/', views.GitHubRepoAnalysisView.as_view(), name='analyze-repo'),
    path('search-history/', views.get_search_history, name='get-search-history'),
    path('add-to-history/', views.add_to_history, name='add-to-history'),
]
