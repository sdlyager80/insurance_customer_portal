import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Close,
  LocalHospital,
  VideoCall,
  Emergency as EmergencyIcon,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface CareOptionsModalProps {
  open: boolean;
  onClose: () => void;
}

interface CareOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
}

const CareOptionsModal = ({ open, onClose }: CareOptionsModalProps) => {
  const navigate = useNavigate();

  const careOptions: CareOption[] = [
    {
      id: 'in-person',
      title: 'In-Person Care',
      description: 'Visit a healthcare provider at their office or clinic for comprehensive medical care.',
      icon: <LocalHospital sx={{ fontSize: 48 }} />,
      color: '#1B75BB',
      route: '/find-care',
    },
    {
      id: 'telehealth',
      title: 'Telehealth',
      description: 'Connect with healthcare providers via video',
      icon: <VideoCall sx={{ fontSize: 48 }} />,
      color: '#8BC53F',
      route: '/find-care?type=telehealth',
    },
    {
      id: 'emergency',
      title: 'Emergency',
      description: 'Emergency contact numbers',
      icon: <EmergencyIcon sx={{ fontSize: 48 }} />,
      color: '#D02E2E',
      route: '/emergency',
    },
  ];

  const handleOptionClick = (option: CareOption) => {
    onClose();
    navigate(option.route);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Choose Your Care Option
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select the type of care that best fits your needs
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <Stack spacing={2}>
          {careOptions.map((option) => (
            <Card
              key={option.id}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea onClick={() => handleOptionClick(option)}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        bgcolor: `${option.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: option.color,
                        flexShrink: 0,
                      }}
                    >
                      {option.icon}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {option.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>

                    <ArrowForward sx={{ color: 'text.secondary', flexShrink: 0 }} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>

        <Box sx={{ mt: 3, p: 2, bgcolor: '#1B75BB08', border: '1px solid #1B75BB20', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Need help deciding?</strong> For non-emergency situations, start with Telehealth or In-Person Care.
            For life-threatening emergencies, call 911 or visit the nearest emergency room immediately.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CareOptionsModal;
