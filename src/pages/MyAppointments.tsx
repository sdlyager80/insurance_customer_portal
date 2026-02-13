import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  CalendarMonth,
  Schedule,
  Person,
  Phone,
  LocationOn,
  VideoCall,
  Cancel,
  CheckCircle,
  ContentCopy,
  CalendarToday,
  Event,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { Appointment, Provider } from '../types/provider';
import { providerService } from '../services/providerService';

const MyAppointments = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const upcoming = providerService.getUpcomingAppointments();
    const past = providerService.getPastAppointments();
    setUpcomingAppointments(upcoming);
    setPastAppointments(past);
  };

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (selectedAppointment) {
      providerService.cancelAppointment(selectedAppointment.id);
      loadAppointments();
      setCancelDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const copyConfirmationNumber = (confirmationNumber: string, appointmentId: string) => {
    navigator.clipboard.writeText(confirmationNumber);
    setCopiedId(appointmentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getProvider = (providerId: string): Provider | undefined => {
    return providerService.getProviderById(providerId);
  };

  const AppointmentCard = ({ appointment, isPast = false }: { appointment: Appointment; isPast?: boolean }) => {
    const provider = getProvider(appointment.providerId);
    const isCancelled = appointment.status === 'cancelled';

    return (
      <Card
        sx={{
          mb: 2,
          opacity: isCancelled ? 0.6 : 1,
          border: isCancelled ? '1px solid #e0e0e0' : '1px solid',
          borderColor: isCancelled ? 'grey.300' : 'primary.light',
          position: 'relative',
        }}
      >
        {isCancelled && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              transform: 'rotate(-15deg)',
            }}
          >
            <Chip
              label="CANCELLED"
              color="error"
              sx={{
                fontWeight: 700,
                fontSize: '0.875rem',
                height: 32,
              }}
            />
          </Box>
        )}
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {appointment.providerName}
              </Typography>
              <Chip
                icon={appointment.visitType === 'telehealth' ? <VideoCall /> : <LocationOn />}
                label={appointment.visitType === 'telehealth' ? 'Telemedicine' : 'In-Person'}
                size="small"
                color={appointment.visitType === 'telehealth' ? 'success' : 'primary'}
                sx={{ mr: 1 }}
              />
              <Chip
                icon={<CheckCircle />}
                label={appointment.status.toUpperCase()}
                size="small"
                color={appointment.status === 'confirmed' ? 'success' : 'default'}
              />
            </Box>
          </Box>

          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonth fontSize="small" color="action" />
              <Typography variant="body2" fontWeight={600}>
                {format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Schedule fontSize="small" color="action" />
              <Typography variant="body2">{appointment.time}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Event fontSize="small" color="action" />
              <Typography variant="body2">{appointment.reason}</Typography>
            </Box>

            {provider && (
              <>
                {appointment.visitType === 'in-person' && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" sx={{ mt: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {provider.address}, {provider.city}, {provider.state}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {provider.phone}
                  </Typography>
                </Box>
              </>
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Confirmation:
              </Typography>
              <Typography variant="body2" fontWeight={600} color="primary">
                {appointment.confirmationNumber}
              </Typography>
              <IconButton
                size="small"
                onClick={() => copyConfirmationNumber(appointment.confirmationNumber, appointment.id)}
                title="Copy confirmation number"
              >
                <ContentCopy fontSize="small" />
              </IconButton>
              {copiedId === appointment.id && (
                <Typography variant="caption" color="success.main">
                  ✓ Copied
                </Typography>
              )}
            </Box>

            {!isPast && !isCancelled && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Cancel />}
                onClick={() => handleCancelClick(appointment)}
                sx={{ minHeight: 36 }}
              >
                Cancel Appointment
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const appointments = activeTab === 0 ? upcomingAppointments : pastAppointments;
  const hasAppointments = appointments.length > 0;

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            My Appointments
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your healthcare appointments
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Tab
              label={`Upcoming (${upcomingAppointments.length})`}
              sx={{ minHeight: 64, fontWeight: 600 }}
            />
            <Tab
              label={`Past (${pastAppointments.length})`}
              sx={{ minHeight: 64, fontWeight: 600 }}
            />
          </Tabs>
        </Paper>

        {/* Appointments List */}
        {hasAppointments ? (
          <Box>
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isPast={activeTab === 1}
              />
            ))}
          </Box>
        ) : (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              bgcolor: 'background.paper',
            }}
          >
            <CalendarMonth sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {activeTab === 0 ? 'No Upcoming Appointments' : 'No Past Appointments'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {activeTab === 0
                ? "You don't have any scheduled appointments. Book an appointment to get started."
                : "You don't have any past appointments yet."}
            </Typography>
            {activeTab === 0 && (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/find-care')}
                startIcon={<CalendarToday />}
                sx={{ minHeight: 44 }}
              >
                Find Care & Book Appointment
              </Button>
            )}
          </Paper>
        )}
      </Container>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Cancel Appointment
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to cancel this appointment?
          </Alert>
          {selectedAppointment && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Provider:</strong> {selectedAppointment.providerName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Date:</strong>{' '}
                {format(new Date(selectedAppointment.date), 'EEEE, MMMM d, yyyy')}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Time:</strong> {selectedAppointment.time}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Confirmation:</strong> {selectedAppointment.confirmationNumber}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCancelDialogOpen(false)}>Keep Appointment</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelConfirm}
            startIcon={<Cancel />}
          >
            Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyAppointments;
