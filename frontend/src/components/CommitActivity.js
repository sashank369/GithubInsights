import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CommitActivity = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Commit Activity</Typography>
        <Typography color="textSecondary">No commit activity data available.</Typography>
      </Paper>
    );
  }


  // Get the last 12 weeks of data
  const recentWeeks = data.slice(-12);
  
  // Format dates for the x-axis
  const labels = recentWeeks.map((weekData, index) => {
    const date = new Date(weekData.week * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  
  // Get commit counts for the y-axis
  const commitCounts = recentWeeks.map(week => week.total);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Commits',
        data: commitCounts,
        borderColor: 'rgba(25, 118, 210, 1)',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: 'rgba(25, 118, 210, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(25, 118, 210, 1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHitRadius: 10,
        pointBorderWidth: 2,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const label = context.parsed.y || 0;
            return `${label} commit${label !== 1 ? 's' : ''}`;
          },
          title: function(context) {
            return context[0].label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          precision: 0,
          callback: function(value) {
            return value % 2 === 0 ? value : '';
          },
        },
      },
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
      },
      point: {
        radius: 3,
        hoverRadius: 6,
      },
    },
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Commit Activity (Last 12 Weeks)</Typography>
      <Box sx={{ height: 300, mt: 2 }}>
        <Line data={chartData} options={options} />
      </Box>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Shows the number of commits per week for the past 12 weeks.
        </Typography>
      </Box>
    </Paper>
  );
};

export default CommitActivity;
