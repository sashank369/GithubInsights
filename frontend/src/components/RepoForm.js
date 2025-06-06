// frontend/src/components/RepoForm.js
import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  InputAdornment, 
  CircularProgress,
  IconButton,
  Collapse
} from '@mui/material';
import { 
  GitHub as GitHubIcon, 
  History as HistoryIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import SearchHistory from './SearchHistory';
import axios from 'axios';

const RepoForm = ({ onSubmit, loading }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }
    
    const githubUrlRegex = /^https?:\/\/github\.com\/[^\s/]+\/[^\s/]+\/?$/;
    if (!githubUrlRegex.test(repoUrl.trim())) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)');
      return;
    }
    
    setError('');
    
    try {
      // Save to history
      await axios.post('/api/add-to-history/', { repo_url: repoUrl.trim() });
      // Submit the form
      onSubmit(repoUrl.trim());
    } catch (err) {
      console.error('Error saving to history:', err);
      // Still submit the form even if history save fails
      onSubmit(repoUrl.trim());
    }
  };

  const handleHistorySelect = (url) => {
    setRepoUrl(url);
    setShowHistory(false);
  };

  const recommendedRepos = [
    'https://github.com/facebook/react',
    'https://github.com/vuejs/vue',
    'https://github.com/tensorflow/tensorflow',
  ];

  return (
    <Paper elevation={2} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Analyze a GitHub Repository
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Enter the URL of any public GitHub repository to view its insights and statistics.
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <Box display="flex" alignItems="flex-start">
          <Box flexGrow={1} position="relative">
            <TextField
              fullWidth
              variant="outlined"
              label="GitHub Repository URL"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              error={!!error}
              helperText={error || " "}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GitHubIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton
              onClick={() => setShowHistory(!showHistory)}
              disabled={loading}
              sx={{ 
                position: 'absolute', 
                right: 8, 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: showHistory ? 'primary.main' : 'inherit'
              }}
            >
              <HistoryIcon />
            </IconButton>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading || !repoUrl.trim()}
            sx={{ ml: 2, minWidth: 120, height: 56 }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </Box>

        <Collapse in={showHistory}>
          <SearchHistory 
            onSelect={handleHistorySelect} 
            onClose={() => setShowHistory(false)} 
          />
        </Collapse>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <strong>Try these popular repositories:</strong>
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {recommendedRepos.map((url) => (
              <Button
                key={url}
                size="small"
                variant="outlined"
                onClick={() => {
                  setRepoUrl(url);
                  setShowHistory(false);
                }}
                disabled={loading}
                sx={{ 
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                {url.replace('https://github.com/', '')}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default RepoForm;