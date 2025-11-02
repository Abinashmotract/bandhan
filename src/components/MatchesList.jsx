import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Skeleton,
  CircularProgress
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import MatchCard from './MatchCard';


const MatchesList = ({
  filteredMatches,
  loading,
  error,
  filters,
  onFilterChange,
  onSearchClick,
  onRetryLoad,
  onShowInterest,
  onShowSuperInterest,
  onViewProfile,
  onToggleShortlist,
  getAge,
  getHeight,
  isLoadingMore,
  hasMoreMatches
}) => {
  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Box sx={{  mb: 3 }}>
          {/* <Typography variant="h4" sx={{ color: '#51365F', fontWeight: 700 }}>
            Matches for You
          </Typography> */}
        </Box>

        {/* Filter Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<FilterIcon />}
            onClick={() => {/* Handle filter dialog */ }}
            sx={{
              backgroundColor: '#51365F',
              '&:hover': {
                backgroundColor: '#c2185b'
              },
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Filters
          </Button>
          <Button
            variant={filters.verified ? "contained" : "outlined"}
            onClick={() => onFilterChange('verified', !filters.verified)}
            sx={{
              borderColor: filters.verified ? '#51365F' : '#e0e0e0',
              backgroundColor: filters.verified ? '#51365F' : 'transparent',
              color: filters.verified ? 'white' : '#666',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: filters.verified ? '#c2185b' : 'rgba(233, 30, 99, 0.1)',
                borderColor: '#51365F'
              }
            }}
          >
            Verified
          </Button>
          <Button
            variant={filters.justJoined ? "contained" : "outlined"}
            onClick={() => onFilterChange('justJoined', !filters.justJoined)}
            sx={{
              borderColor: filters.justJoined ? '#51365F' : '#e0e0e0',
              backgroundColor: filters.justJoined ? '#51365F' : 'transparent',
              color: filters.justJoined ? 'white' : '#666',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: filters.justJoined ? '#c2185b' : 'rgba(233, 30, 99, 0.1)',
                borderColor: '#51365F'
              }
            }}
          >
            Just Joined
          </Button>
          <Button
            variant={filters.nearby ? "contained" : "outlined"}
            onClick={() => onFilterChange('nearby', !filters.nearby)}
            sx={{
              borderColor: filters.nearby ? '#51365F' : '#e0e0e0',
              backgroundColor: filters.nearby ? '#51365F' : 'transparent',
              color: filters.nearby ? 'white' : '#666',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: filters.nearby ? '#c2185b' : 'rgba(233, 30, 99, 0.1)',
                borderColor: '#51365F'
              }
            }}
          >
            Nearby
          </Button>
        </Box>
      </Box>

      {/* Matches Grid */}
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 3,
          width: '100%',
          maxWidth: '100%'
        }}>
          {[...Array(6)].map((_, index) => (
            <Card key={index} sx={{ height: 280 }}>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <CardContent>
                <Skeleton variant="text" width="80%" height={30} />
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={onRetryLoad}
            sx={{ backgroundColor: '#51365F' }}
          >
            Try Again
          </Button>
        </Box>
      ) : !Array.isArray(filteredMatches) || filteredMatches.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No matches found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search criteria
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 3,
          width: '100%',
          maxWidth: '100%'
        }}>
          {Array.isArray(filteredMatches) && filteredMatches.map((match) => (
            <MatchCard
              key={match._id}
              match={match}
              onShowInterest={onShowInterest}
              onShowSuperInterest={onShowSuperInterest}
              onViewProfile={onViewProfile}
              onToggleShortlist={onToggleShortlist}
              getAge={getAge}
              getHeight={getHeight}
            />
          ))}
          
          {/* Loading More Indicator */}
          {isLoadingMore && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 4 
            }}>
              <CircularProgress size={24} sx={{ color: '#51365F', mr: 2 }} />
              <Typography variant="body2" sx={{ color: '#666' }}>
                Loading more matches...
              </Typography>
            </Box>
          )}
          
          {/* End of Results Indicator */}
          {!hasMoreMatches && Array.isArray(filteredMatches) && filteredMatches.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 4 
            }}>
              <Typography variant="body2" sx={{ color: '#999' }}>
                You've reached the end of the matches
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default MatchesList;
