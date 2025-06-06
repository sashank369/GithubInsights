// frontend/src/components/SearchHistory.js
import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  IconButton,
  Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

const SearchHistory = ({ onSelect, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/search-history/');
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (index, e) => {
    e.stopPropagation();
    try {
      const newHistory = [...history];
      newHistory.splice(index, 1);
      setHistory(newHistory);
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2, mt: 1 }}>
        <Typography>Loading history...</Typography>
      </Paper>
    );
  }

  if (history.length === 0) {
    return (
      <Paper sx={{ p: 2, mt: 1 }}>
        <Typography color="textSecondary">No search history yet</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
      <List dense>
        {history.map((url, index) => (
          <ListItem 
            key={index} 
            button 
            onClick={() => onSelect(url)}
            secondaryAction={
              <IconButton 
                edge="end" 
                size="small"
                onClick={(e) => handleDelete(index, e)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemText 
              primary={url} 
              primaryTypographyProps={{ noWrap: true, title: url }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SearchHistory;