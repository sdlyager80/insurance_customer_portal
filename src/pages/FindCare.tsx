import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Slider,
  InputAdornment,
  IconButton,
  Chip,
  Alert,
  Fade,
  Paper,
  Stack,
} from '@mui/material';
import {
  Search,
  MyLocation,
  ViewList,
  Map as MapIcon,
  LocalHospital,
  Tune,
  Clear,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import ProviderCard from '../components/ProviderCard';
import ProviderMap from '../components/ProviderMap';
import BookingModal from '../components/BookingModal';
import type { Provider, Location, SearchFilters, ViewMode } from '../types/provider';
import { providerService } from '../services/providerService';
import { geocodingService } from '../services/geocodingService';
import './FindCare.css';

const FindCare = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [userLocation, setUserLocation] = useState<Location | undefined>();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    country: 'all',
    address: '',
    distance: 50,
    specialty: 'all',
    doctorName: '',
  });

  const countries = ['all', ...providerService.getCountries()];
  const specialties = ['all', ...providerService.getSpecialties()];

  // Load initial data
  useEffect(() => {
    const initialProviders = providerService.getAllProviders();
    setProviders(initialProviders);
    setFilteredProviders(initialProviders);

    // Check if there's a type parameter (for telehealth)
    const type = searchParams.get('type');
    if (type === 'telehealth') {
      const telemedicineProviders = initialProviders.filter(p => p.telemedicine);
      setFilteredProviders(telemedicineProviders);
    }
  }, [searchParams]);

  // Get current location
  const handleGetLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await geocodingService.getCurrentLocation();
      if (location) {
        setUserLocation(location);
        setFilters(prev => ({ ...prev, address: location.address || '' }));
        applyFilters({ ...filters, address: location.address || '' }, location);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  // Search address with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (filters.address.length > 3) {
        const results = await geocodingService.searchAddress(filters.address);
        setAddressSuggestions(results);
        setShowSuggestions(results.length > 0);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.address]);

  // Handle address selection from suggestions
  const handleSelectAddress = (result: any) => {
    const location: Location = {
      latitude: result.lat,
      longitude: result.lon,
      address: result.display_name,
    };
    setUserLocation(location);
    setFilters(prev => ({ ...prev, address: result.display_name }));
    setShowSuggestions(false);
    applyFilters({ ...filters, address: result.display_name }, location);
  };

  // Apply filters
  const applyFilters = useCallback((currentFilters: SearchFilters, location?: Location) => {
    setLoading(true);
    setTimeout(() => {
      const results = providerService.searchProviders(
        currentFilters,
        location || userLocation
      );
      setFilteredProviders(results);
      setLoading(false);
    }, 300);
  }, [userLocation]);

  // Handle filter changes
  const handleFilterChange = (field: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // Clear filters
  const handleClearFilters = () => {
    const resetFilters: SearchFilters = {
      country: 'all',
      address: '',
      distance: 50,
      specialty: 'all',
      doctorName: '',
    };
    setFilters(resetFilters);
    setUserLocation(undefined);
    setFilteredProviders(providers);
  };

  // Handle booking
  const handleBookProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setBookingModalOpen(true);
  };

  const hasActiveFilters =
    filters.country !== 'all' ||
    filters.address !== '' ||
    filters.specialty !== 'all' ||
    filters.doctorName !== '' ||
    userLocation !== undefined;

  return (
    <>
      <Box className="find-care-container">
        {/* Header */}
        <Box className="find-care-header">
          <Container maxWidth="lg">
            <Box position="relative" zIndex={1}>
              <Typography variant="h2" fontWeight={700} gutterBottom>
                Find Care
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95 }}>
                Search for healthcare providers near you
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg">
          {/* Search Filters */}
          <Box className="search-filters">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tune />
                Search Filters
              </Typography>
              {hasActiveFilters && (
                <Button
                  size="small"
                  startIcon={<Clear />}
                  onClick={handleClearFilters}
                >
                  Clear All
                </Button>
              )}
            </Box>

            <Box className="filter-grid">
              {/* Country Select */}
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  value={filters.country}
                  label="Country"
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                >
                  <MenuItem value="all">All Countries</MenuItem>
                  {countries.slice(1).map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Address Search */}
              <Box sx={{ position: 'relative' }}>
                <TextField
                  fullWidth
                  label="Address or Location"
                  value={filters.address}
                  onChange={(e) => handleFilterChange('address', e.target.value)}
                  onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleGetLocation}
                          disabled={locationLoading}
                          edge="end"
                        >
                          {locationLoading ? <CircularProgress size={20} /> : <MyLocation />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {showSuggestions && (
                  <Paper className="autocomplete-dropdown">
                    {addressSuggestions.map((result, index) => (
                      <Box
                        key={index}
                        className="autocomplete-item"
                        onClick={() => handleSelectAddress(result)}
                      >
                        <Typography variant="body2">{result.display_name}</Typography>
                      </Box>
                    ))}
                  </Paper>
                )}
              </Box>

              {/* Specialty Select */}
              <FormControl fullWidth>
                <InputLabel>Specialty</InputLabel>
                <Select
                  value={filters.specialty}
                  label="Specialty"
                  onChange={(e) => handleFilterChange('specialty', e.target.value)}
                >
                  <MenuItem value="all">All Specialties</MenuItem>
                  {specialties.slice(1).map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Doctor Name Search */}
              <TextField
                fullWidth
                label="Doctor Name"
                value={filters.doctorName}
                onChange={(e) => handleFilterChange('doctorName', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Distance Slider */}
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', lg: '1 / 3' }, px: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Distance: {filters.distance} miles
                </Typography>
                <Slider
                  value={filters.distance}
                  onChange={(_, value) => handleFilterChange('distance', value)}
                  min={5}
                  max={100}
                  step={5}
                  marks={[
                    { value: 5, label: '5mi' },
                    { value: 50, label: '50mi' },
                    { value: 100, label: '100mi' },
                  ]}
                  valueLabelDisplay="auto"
                  className="distance-slider"
                  disabled={!userLocation}
                />
                {!userLocation && (
                  <Typography variant="caption" color="text.secondary">
                    Enable location to filter by distance
                  </Typography>
                )}
              </Box>
            </Box>

            {userLocation && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Showing providers near: {userLocation.address}
              </Alert>
            )}
          </Box>

          {/* Results Section */}
          <Box sx={{ mt: 4, mb: 4 }}>
            <Box className="results-header">
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  {loading ? 'Searching...' : `${filteredProviders.length} Provider${filteredProviders.length !== 1 ? 's' : ''} Found`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hasActiveFilters && 'Filtered results based on your criteria'}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {filters.country !== 'all' && (
                  <Chip
                    label={`Country: ${filters.country}`}
                    onDelete={() => handleFilterChange('country', 'all')}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.specialty !== 'all' && (
                  <Chip
                    label={`Specialty: ${filters.specialty}`}
                    onDelete={() => handleFilterChange('specialty', 'all')}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.doctorName && (
                  <Chip
                    label={`Name: ${filters.doctorName}`}
                    onDelete={() => handleFilterChange('doctorName', '')}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Stack>

              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, mode) => mode && setViewMode(mode)}
                size="small"
                sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
              >
                <ToggleButton value="list" sx={{ minHeight: 44, flex: { xs: 1, sm: 'initial' } }}>
                  <ViewList sx={{ mr: { xs: 0, sm: 1 } }} />
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'inline' } }}>
                    List
                  </Box>
                </ToggleButton>
                <ToggleButton value="map" sx={{ minHeight: 44, flex: { xs: 1, sm: 'initial' } }}>
                  <MapIcon sx={{ mr: { xs: 0, sm: 1 } }} />
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'inline' } }}>
                    Map
                  </Box>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Loading State */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Empty State */}
            {!loading && filteredProviders.length === 0 && (
              <Fade in>
                <Box className="empty-state">
                  <LocalHospital className="empty-state-icon" />
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    No Providers Found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Try adjusting your filters or search criteria
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleClearFilters}
                    startIcon={<Clear />}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </Fade>
            )}

            {/* List View */}
            {!loading && viewMode === 'list' && filteredProviders.length > 0 && (
              <Fade in>
                <Box className="providers-grid">
                  {filteredProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      onBook={handleBookProvider}
                    />
                  ))}
                </Box>
              </Fade>
            )}

            {/* Map View */}
            {!loading && viewMode === 'map' && filteredProviders.length > 0 && (
              <Fade in>
                <Box className="map-container">
                  <ProviderMap
                    providers={filteredProviders}
                    userLocation={userLocation}
                    onBookProvider={handleBookProvider}
                  />
                </Box>
              </Fade>
            )}
          </Box>
        </Container>
      </Box>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        provider={selectedProvider}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedProvider(null);
        }}
      />
    </>
  );
};

export default FindCare;
