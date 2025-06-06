import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import Header from './components/Header';
import RepoForm from './components/RepoForm';
import RepoDetails from './components/RepoDetails';
import CommitActivity from './components/CommitActivity';
import ContributorsList from './components/ContributorsList';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
      marginBottom: '1rem',
    },
  },
});

function App() {
  const [repoData, setRepoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRepoData = async (repoUrl) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repo_url: repoUrl }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch repository data');
      }
      
      const data = await response.json();
      setRepoData(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching repository data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <RepoForm onSubmit={fetchRepoData} loading={loading} />
        
        {error && (
          <Box mt={4} p={2} bgcolor="error.light" color="error.contrastText" borderRadius={1}>
            {error}
          </Box>
        )}
        
        {loading && (
          <Box mt={4} display="flex" justifyContent="center">
            <div className="spinner"></div>
          </Box>
        )}
        
        {repoData && (
          <>
            <RepoDetails data={repoData} />
            <Box mt={4}>
              <CommitActivity data={repoData.commit_ac} />
            </Box>
            <Box mt={4}>
              <ContributorsList 
                contributors={repoData.top_contributors} 
                totalContributors={repoData.contributors_count} 
              />
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
