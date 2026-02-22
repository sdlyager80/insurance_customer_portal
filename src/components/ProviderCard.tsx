import { Card, CardContent, Typography, Button, Box, Chip, Stack, Avatar } from '@mui/material';
import {
  Phone,
  LocationOn,
  VideoCall,
  Star,
  Navigation as NavigationIcon,
} from '@mui/icons-material';
import type { Provider } from '../types/provider';

interface ProviderCardProps {
  provider: Provider;
  onBook: (provider: Provider) => void;
}

const ProviderCard = ({ provider, onBook }: ProviderCardProps) => {
  const formatPhone = (phone: string) => {
    return phone;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'primary.main',
              fontSize: '1.5rem',
              mr: 2,
            }}
          >
            {provider.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {provider.name}
            </Typography>
            <Chip
              label={provider.specialty}
              size="small"
              sx={{ mb: 0.5, color: '#000000', fontWeight: 600, border: '1px solid #1B75BB4D', bgcolor: '#1B75BB20' }}
            />
            {provider.telemedicine && (
              <Chip
                icon={<VideoCall fontSize="small" sx={{ color: '#000000 !important' }} />}
                label="Telemedicine"
                size="small"
                sx={{ ml: 0.5, mb: 0.5, color: '#000000', fontWeight: 600, border: '1px solid #37A5264D', bgcolor: '#37A52620' }}
              />
            )}
          </Box>
        </Box>

        {/* Rating */}
        {provider.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Star sx={{ color: '#FFC107', fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2" fontWeight={600}>
              {provider.rating.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              rating
            </Typography>
          </Box>
        )}

        {/* Contact Info */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <LocationOn fontSize="small" color="action" sx={{ mt: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {provider.address}
              <br />
              {provider.city}, {provider.state} {provider.zip}
              <br />
              {provider.country}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatPhone(provider.phone)}
            </Typography>
          </Box>

          {provider.distance !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NavigationIcon fontSize="small" color="action" />
              <Typography variant="body2" fontWeight={600} color="#000000">
                {provider.distance.toFixed(1)} miles away
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Action Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => onBook(provider)}
          sx={{
            mt: 'auto',
            minHeight: 44,
            fontWeight: 600,
          }}
        >
          Book Appointment
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProviderCard;
