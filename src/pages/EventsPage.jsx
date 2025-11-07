import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  VideoCall as VideoCallIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccess, showError } from '../utils/toast';

const EventsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState(0);
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 50,
    eventType: 'virtual',
    category: 'speed-dating',
    price: 0
  });

  const eventTypes = [
    { value: 'virtual', label: 'Virtual Event', icon: <VideoCallIcon /> },
    { value: 'physical', label: 'Physical Event', icon: <LocationIcon /> },
    { value: 'hybrid', label: 'Hybrid Event', icon: <EventIcon /> }
  ];

  const eventCategories = [
    'Speed Dating',
    'Cultural Meet',
    'Religious Gathering',
    'Professional Networking',
    'Hobby Group',
    'Travel Group',
    'Cooking Class',
    'Dance Workshop',
    'Book Club',
    'Fitness Group'
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await eventsAPI.getEvents();
      // setEvents(response.data);
      // setMyEvents(response.data.filter(event => event.isRegistered));
      setEvents([]);
      setMyEvents([]);
    } catch (error) {
      showError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRegisterEvent = async (eventId) => {
    try {
      // API call to register for event
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, isRegistered: true, currentParticipants: event.currentParticipants + 1 }
          : event
      ));
      
      showSuccess('Successfully registered for the event!');
    } catch (error) {
      showError('Failed to register for event');
    }
  };

  const handleBookmarkEvent = async (eventId) => {
    try {
      // API call to bookmark event
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, isBookmarked: !event.isBookmarked }
          : event
      ));
      
      showSuccess('Event bookmarked!');
    } catch (error) {
      showError('Failed to bookmark event');
    }
  };

  const handleCreateEvent = async () => {
    try {
      // API call to create event
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const event = {
        id: Date.now(),
        ...newEvent,
        organizer: user?.name || 'You',
        organizerImage: user?.profileImage || '',
        currentParticipants: 0,
        isRegistered: false,
        isBookmarked: false,
        rating: 0,
        tags: [newEvent.category]
      };
      
      setEvents(prev => [event, ...prev]);
      setShowCreateDialog(false);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: 50,
        eventType: 'virtual',
        category: 'speed-dating',
        price: 0
      });
      
      showSuccess('Event created successfully!');
    } catch (error) {
      showError('Failed to create event');
    }
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderEventCard = (event) => (
    <Card key={event.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={event.image}
        alt={event.title}
        sx={{ cursor: 'pointer' }}
        onClick={() => handleViewEvent(event)}
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h2" sx={{ 
            fontWeight: 600, 
            color: '#37474f',
            cursor: 'pointer',
            '&:hover': { color: '#51365F' }
          }} onClick={() => handleViewEvent(event)}>
            {event.title}
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleBookmarkEvent(event.id)}
            sx={{ color: event.isBookmarked ? '#ff9800' : '#ccc' }}
          >
            {event.isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {event.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarIcon sx={{ fontSize: 16, color: '#51365F', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(event.date)} at {event.time}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationIcon sx={{ fontSize: 16, color: '#51365F', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {event.location}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PeopleIcon sx={{ fontSize: 16, color: '#51365F', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {event.currentParticipants}/{event.maxParticipants} participants
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {event.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{
                backgroundColor: 'rgba(216, 27, 96, 0.1)',
                color: '#51365F',
                fontSize: '0.75rem'
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: '#51365F', fontWeight: 600 }}>
            {event.price === 0 ? 'Free' : `₹${event.price}`}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ShareIcon />}
              sx={{ borderColor: '#51365F', color: '#51365F' }}
            >
              Share
            </Button>
            
            {event.isRegistered ? (
              <Button
                size="small"
                variant="contained"
                disabled
                sx={{ background: '#4caf50' }}
              >
                Registered
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                onClick={() => handleRegisterEvent(event.id)}
                sx={{ background: '#51365F' }}
              >
                Register
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ 
          color: '#51365F', 
          fontWeight: 700 
        }}>
          Matchmaking Events
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateDialog(true)}
          sx={{
            background: '#51365F',
            '&:hover': {
              background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
            }
          }}
        >
          Create Event
        </Button>
      </Box>

      <Paper elevation={2} sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#51365F'
            },
            '& .MuiTab-root': {
              color: '#666',
              '&.Mui-selected': {
                color: '#51365F'
              }
            }
          }}
        >
          <Tab label="All Events" />
          <Tab 
            label={
              <Badge badgeContent={myEvents.length} color="primary">
                My Events
              </Badge>
            } 
          />
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {(activeTab === 0 ? events : myEvents).map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              {renderEventCard(event)}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Event Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={newEvent.eventType}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, eventType: e.target.value }))}
                  label="Event Type"
                >
                  {eventTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                  label="Category"
                >
                  {eventCategories.map((category) => (
                    <MenuItem key={category} value={category.toLowerCase().replace(' ', '-')}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max Participants"
                type="number"
                value={newEvent.maxParticipants}
                onChange={(e) => setNewEvent(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price (₹)"
                type="number"
                value={newEvent.price}
                onChange={(e) => setNewEvent(prev => ({ ...prev, price: parseInt(e.target.value) }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateEvent} variant="contained" sx={{ background: '#51365F' }}>
            Create Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onClose={() => setShowEventDialog(false)} maxWidth="md" fullWidth>
        {selectedEvent && (
          <>
            <DialogTitle>{selectedEvent.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }}
                />
              </Box>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedEvent.description}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarIcon sx={{ fontSize: 20, color: '#51365F', mr: 1 }} />
                    <Typography variant="body2">
                      {formatDate(selectedEvent.date)} at {selectedEvent.time}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 20, color: '#51365F', mr: 1 }} />
                    <Typography variant="body2">{selectedEvent.location}</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PeopleIcon sx={{ fontSize: 20, color: '#51365F', mr: 1 }} />
                    <Typography variant="body2">
                      {selectedEvent.currentParticipants}/{selectedEvent.maxParticipants} participants
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: '#51365F' }}>
                      {selectedEvent.price === 0 ? 'Free' : `₹${selectedEvent.price}`}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" sx={{ mb: 2 }}>Organizer</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={selectedEvent.organizerImage} sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1">{selectedEvent.organizer}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon sx={{ fontSize: 16, color: '#ff9800', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {selectedEvent.rating}/5
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowEventDialog(false)}>Close</Button>
              <Button
                variant="contained"
                onClick={() => handleRegisterEvent(selectedEvent.id)}
                sx={{ background: '#51365F' }}
              >
                {selectedEvent.isRegistered ? 'Registered' : 'Register Now'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default EventsPage;
