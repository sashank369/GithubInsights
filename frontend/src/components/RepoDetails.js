import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip,
  Link,
  Divider,
  useTheme,
  Tooltip
} from '@mui/material';
import { 
  Star as StarIcon, 
  CallSplit as ForkIcon, 
  BugReport as BugReportIcon,
  Code as CodeIcon,
  People as PeopleIcon,
  Update as UpdateIcon,
  GitHub as GitHubIcon,
  // PullRequest as PullRequestIcon
} from '@mui/icons-material';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const StatItem = ({ icon: Icon, label, value, color = 'text.primary', tooltip = '' }) => (
  <Tooltip title={tooltip} arrow>
    <Box sx={{ 
      p: 1.5, 
      borderRadius: 1, 
      bgcolor: 'background.paper',
      height: '100%',
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 1,
      }
    }}>
      <Box display="flex" alignItems="center" mb={0.5}>
        {Icon && <Icon sx={{ color, fontSize: 18, mr: 1 }} />}
        <Typography variant="subtitle2" color="text.secondary" noWrap>
          {label}
        </Typography>
      </Box>
      <Typography variant="subtitle1" color={color} fontWeight="medium" noWrap>
        {value}
      </Typography>
    </Box>
  </Tooltip>
);

const RepoDetails = ({ data }) => {
  const theme = useTheme();
  
  if (!data) return null;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <GitHubIcon 
            sx={{ 
              color: 'text.primary', 
              mr: 1.5,
              fontSize: 32
            }} 
          />
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 600,
                lineHeight: 1.2,
                mb: 0.5
              }}
            >
              <Link 
                href={data.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                underline="none"
                color="text.primary"
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                  }
                }}
              >
                {data.full_name}
              </Link>
            </Typography>
            {data.description && (
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mt: 1,
                  lineHeight: 1.5
                }}
              >
                {data.description}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Meta Info with Tooltips */}
        <Box 
          display="flex" 
          flexWrap="wrap" 
          gap={1} 
          sx={{ 
            mt: 2,
            '& > *': {
              mr: 1,
              mb: 1,
            }
          }}
        >
          {data.language && (
            <Tooltip title="Primary programming language" arrow>
              <Chip 
                label={data.language}
                size="small"
                variant="outlined"
                icon={<CodeIcon fontSize="small" />}
              />
            </Tooltip>
          )}
          
          <Tooltip title="Number of stars" arrow>
            <Chip 
              label={data.stargazers_count?.toLocaleString()}
              size="small"
              variant="outlined"
              icon={<StarIcon fontSize="small" />}
            />
          </Tooltip>
          
          <Tooltip title="Number of forks" arrow>
            <Chip 
              label={data.forks_count?.toLocaleString()}
              size="small"
              variant="outlined"
              icon={<ForkIcon fontSize="small" />}
            />
          </Tooltip>
          
          <Tooltip title="Open issues" arrow>
            <Chip 
              label={data.open_issues_count?.toLocaleString()}
              size="small"
              variant="outlined"
              color="error"
              icon={<BugReportIcon fontSize="small" />}
            />
          </Tooltip>
          
          {/* <Tooltip title="Open pull requests" arrow>
            <Chip 
              label={data.open_prs_count?.toLocaleString()}
              size="small"
              variant="outlined"
              color="primary"
              icon={<PullRequestIcon fontSize="small" />}
            />
          </Tooltip> */}
        </Box>
      </Box>

      {/* Stats Grid - Compact */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatItem 
            icon={PeopleIcon}
            label="Watchers"
            value={data.subscribers_count?.toLocaleString()}
            color="primary.main"
            tooltip="Number of users watching this repository"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatItem 
            icon={UpdateIcon}
            label="Updated"
            value={formatDate(data.updated_at)}
            color="text.secondary"
            tooltip="Last update date"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatItem 
            label="Created"
            value={formatDate(data.created_at)}
            color="text.secondary"
            tooltip="Repository creation date"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatItem 
            label="Open Pull Requests"
            value={data.open_prs_count?.toLocaleString() || 'None'}
            color="text.secondary"
            tooltip="Number of open pull requests"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatItem 
            label="Number of Branches"
            value={data.branch_count?.toLocaleString() || 'None'}
            color="text.secondary"
            tooltip="Number of branches"
          />
        </Grid>
      </Grid>

      {/* Commit Activity */}
      {data.commit_activity && (
        <Box 
          sx={{ 
            p: 3, 
            borderRadius: 1, 
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            mb: 3
          }}
        >
          <Typography 
            variant="subtitle1" 
            fontWeight="medium" 
            gutterBottom
            sx={{ 
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}
          >
            <UpdateIcon sx={{ mr: 1 }} /> Commit Activity
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">Total Commits</Typography>
                <Typography variant="h6">{data.commit_activity.total_commits}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">Avg/Week</Typography>
                <Typography variant="h6">{data.commit_activity.avg_commits_per_week.toFixed(1)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">Most Active Day</Typography>
                <Typography variant="h6" textTransform="capitalize">
                  {data.commit_activity.most_active_day}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">Most in a Week</Typography>
                <Typography variant="h6">{data.commit_activity.most_commits_in_week}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Topics */}
      {data.topics?.length > 0 && (
        <Box>
          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            gutterBottom
            sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
          >
            Topics
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {data.topics.map((topic) => (
              <Chip 
                key={topic} 
                label={topic} 
                size="small" 
                component="a" 
                href={`https://github.com/topics/${topic}`}
                target="_blank"
                rel="noopener noreferrer"
                clickable
                sx={{
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default RepoDetails;