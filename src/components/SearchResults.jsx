import React from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import MatchCard from './MatchCard';

const SearchResults = ({ 
  searchResults, 
  loading, 
  error, 
  onModifySearch, 
  onRetrySearch,
  onShowInterest,
  onShowSuperInterest,
  onViewProfile,
  getAge,
  getHeight
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ 
          color: '#51365F', 
          fontWeight: 700 
        }}>
          Search Results ({searchResults.length} profiles found)
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowForwardIcon />}
          onClick={onModifySearch}
          sx={{
            borderColor: '#51365F',
            color: '#51365F',
            '&:hover': {
              borderColor: '#51365F',
              backgroundColor: 'rgba(216, 27, 96, 0.04)'
            }
          }}
        >
          Modify Search
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ color: '#51365F' }} />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={onRetrySearch}
            sx={{ backgroundColor: '#51365F' }}
          >
            Try Again
          </Button>
        </Box>
      ) : searchResults.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No profiles found matching your criteria
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search criteria
          </Typography>
          <Button
            variant="contained"
            onClick={onModifySearch}
            sx={{ backgroundColor: '#51365F' }}
          >
            Modify Search
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {searchResults.map((profile) => (
            <MatchCard
              key={profile._id}
              match={profile}
              onShowInterest={onShowInterest}
              onShowSuperInterest={onShowSuperInterest}
              onViewProfile={onViewProfile}
              getAge={getAge}
              getHeight={getHeight}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchResults;
