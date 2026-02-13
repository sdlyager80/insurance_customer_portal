import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';
import {
  LocalPolice,
  LocalHospital,
  Psychology,
  Phone,
} from '@mui/icons-material';

interface EmergencyContact {
  title: string;
  number: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const Emergency = () => {
  const emergencyContacts: EmergencyContact[] = [
    {
      title: 'Emergency Services',
      number: '911',
      description: 'Police, Fire, Ambulance',
      icon: <LocalPolice sx={{ fontSize: 40 }} />,
      color: '#D02E2E',
    },
    {
      title: 'Poison Control',
      number: '1-800-222-1222',
      description: 'Poison emergencies',
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: 'Crisis Lifeline',
      number: '988',
      description: 'Mental health crisis support',
      icon: <Psychology sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
    {
      title: 'Insurance Emergency Line',
      number: '1-800-555-0199',
      description: '24/7 insurance support',
      icon: <Phone sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
  ];

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={700} color="error.main" gutterBottom>
            Emergency
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Emergency contact numbers
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Emergency Services Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
            Emergency Services
          </Typography>

          <Stack spacing={3}>
            {emergencyContacts.map((contact, index) => (
              <Card
                key={index}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                    borderColor: contact.color,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2,
                        bgcolor: `${contact.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: contact.color,
                        flexShrink: 0,
                      }}
                    >
                      {contact.icon}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {contact.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                          color: contact.color,
                          mb: 1,
                          fontFamily: 'monospace',
                        }}
                      >
                        <a
                          href={`tel:${contact.number.replace(/[^0-9]/g, '')}`}
                          style={{
                            textDecoration: 'none',
                            color: 'inherit',
                          }}
                        >
                          {contact.number}
                        </a>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {contact.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>

        {/* Important Notice */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            bgcolor: 'error.50',
            borderRadius: 2,
            border: '2px solid',
            borderColor: 'error.main',
          }}
        >
          <Typography variant="h6" color="error.dark" fontWeight={600} gutterBottom>
            ⚠️ Important
          </Typography>
          <Typography variant="body2" color="error.dark">
            For life-threatening emergencies, call 911 immediately. Do not wait or try to drive yourself to the hospital.
            Emergency services can provide immediate assistance and get you the help you need faster.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Emergency;
