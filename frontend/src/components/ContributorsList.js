import React from 'react';
import { Paper, Typography, Box, Avatar, Grid, Link, Divider, Chip } from '@mui/material';
import { Person, Star, Code, Link as LinkIcon } from '@mui/icons-material';

const ContributorsList = ({ contributors = [], totalContributors = 0 }) => {
  if (!contributors || contributors.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Contributors</Typography>
        <Typography color="textSecondary">No contributor data available.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Top Contributors</Typography>
        <Chip 
          label={`${totalContributors} ${totalContributors === 1 ? 'Contributor' : 'Contributors'}`} 
          size="small"
          variant="outlined"
        />
      </Box>
      
      <Grid container spacing={2}>
        {contributors.map((contributor, index) => (
          <Grid item xs={12} sm={6} md={4} key={contributor.login}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2, 
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                transition: 'background-color 0.2s',
              }}
            >
              <Avatar 
                src={contributor.avatar_url} 
                alt={contributor.login}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Link 
                    href={contributor.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    color="primary"
                    underline="hover"
                    sx={{ 
                      fontWeight: 'medium',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                      mr: 1
                    }}
                  >
                    {contributor.login}
                  </Link>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <Chip 
                    icon={<Code fontSize="small" />} 
                    label={`${contributor.contributions} ${contributor.contributions === 1 ? 'commit' : 'commits'}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      
      {totalContributors > contributors.length && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Showing top {contributors.length} of {totalContributors} contributors
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ContributorsList;
