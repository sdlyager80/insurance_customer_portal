import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  IconButton,
  Chip,
  Stack,
  Paper,
  Divider,
} from '@mui/material';
import {
  Close,
  CalendarMonth,
  Schedule,
  Description,
  CheckCircle,
  ContentCopy,
  CalendarToday,
  VideoCall,
  LocationOn,
} from '@mui/icons-material';
import { format, addDays, startOfTomorrow } from 'date-fns';
import type { Provider, Appointment } from '../types/provider';
import { providerService } from '../services/providerService';

interface BookingModalProps {
  open: boolean;
  provider: Provider | null;
  onClose: () => void;
}

const steps = ['Select Date', 'Select Time', 'Visit Details', 'Confirm', 'Confirmation'];

const BookingModal = ({ open, provider, onClose }: BookingModalProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [visitType, setVisitType] = useState<'in-person' | 'telehealth'>('in-person');
  const [visitReason, setVisitReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleNext = async () => {
    if (activeStep === steps.length - 2) {
      // Confirm step - book the appointment
      setLoading(true);
      try {
        const reason = visitReason === 'Other' ? otherReason : visitReason;
        const bookedAppointment = await providerService.bookAppointment(
          provider!.id,
          selectedDate,
          selectedTime,
          reason,
          visitType
        );
        setAppointment(bookedAppointment);
        setActiveStep((prev) => prev + 1);
      } catch (error) {
        console.error('Booking error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleClose = () => {
    // Reset all state
    setActiveStep(0);
    setSelectedDate('');
    setSelectedTime('');
    setVisitType('in-person');
    setVisitReason('');
    setOtherReason('');
    setAppointment(null);
    setCopied(false);
    onClose();
  };

  const copyConfirmationNumber = () => {
    if (appointment?.confirmationNumber) {
      navigator.clipboard.writeText(appointment.confirmationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const addToCalendar = () => {
    if (!appointment || !provider) return;

    const event = {
      title: `Appointment with ${provider.name}`,
      description: `${appointment.reason} - ${appointment.visitType === 'telehealth' ? 'Telemedicine' : 'In-Person'} Visit`,
      location: appointment.visitType === 'in-person' ? `${provider.address}, ${provider.city}, ${provider.state}` : 'Online',
      startTime: new Date(`${appointment.date} ${appointment.time}`),
    };

    // Create .ics file content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${format(event.startTime, "yyyyMMdd'T'HHmmss")}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'appointment.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getAvailableDates = () => {
    const dates = [];
    const tomorrow = startOfTomorrow();
    for (let i = 0; i < 14; i++) {
      const date = addDays(tomorrow, i);
      dates.push(format(date, 'yyyy-MM-dd'));
    }
    return dates;
  };

  const availableDates = getAvailableDates();
  const availableTimes = provider ? providerService.getAvailableTimeSlots(provider.id, selectedDate) : [];
  const visitReasons = providerService.getVisitReasons();

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return selectedDate !== '';
      case 1:
        return selectedTime !== '';
      case 2:
        return visitReason !== '' && (visitReason !== 'Other' || otherReason.trim() !== '');
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (!provider) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Book Appointment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {provider.name} • {provider.specialty}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 0: Select Date */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonth color="primary" />
              Select Appointment Date
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Date</InputLabel>
              <Select
                value={selectedDate}
                label="Date"
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {availableDates.map((date) => (
                  <MenuItem key={date} value={date}>
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Step 1: Select Time */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Schedule color="primary" />
              Select Appointment Time
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 1 }}>
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'contained' : 'outlined'}
                  onClick={() => setSelectedTime(time)}
                  sx={{ minHeight: 44 }}
                >
                  {time}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {/* Step 2: Visit Details */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Description color="primary" />
              Visit Details
            </Typography>

            {/* Visit Type */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Visit Type
              </Typography>
              <RadioGroup value={visitType} onChange={(e) => setVisitType(e.target.value as any)}>
                <FormControlLabel
                  value="in-person"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn fontSize="small" />
                      <span>In-Person Visit</span>
                    </Box>
                  }
                />
                {provider.telemedicine && (
                  <FormControlLabel
                    value="telehealth"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VideoCall fontSize="small" />
                        <span>Telemedicine (Virtual Visit)</span>
                      </Box>
                    }
                  />
                )}
              </RadioGroup>
            </Box>

            {/* Visit Reason */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Reason for Visit</InputLabel>
              <Select
                value={visitReason}
                label="Reason for Visit"
                onChange={(e) => setVisitReason(e.target.value)}
              >
                {visitReasons.map((reason) => (
                  <MenuItem key={reason} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {visitReason === 'Other' && (
              <TextField
                fullWidth
                label="Please specify"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                multiline
                rows={3}
              />
            )}
          </Box>
        )}

        {/* Step 3: Confirm */}
        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="primary" />
              Review and Confirm
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Provider
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {provider.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {provider.specialty}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
                  </Typography>
                  <Typography variant="body2">
                    {selectedTime}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Visit Type
                  </Typography>
                  <Chip
                    icon={visitType === 'telehealth' ? <VideoCall /> : <LocationOn />}
                    label={visitType === 'telehealth' ? 'Telemedicine' : 'In-Person'}
                    color={visitType === 'telehealth' ? 'success' : 'primary'}
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Reason for Visit
                  </Typography>
                  <Typography variant="body1">
                    {visitReason === 'Other' ? otherReason : visitReason}
                  </Typography>
                </Box>

                {visitType === 'in-person' && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body2">
                        {provider.address}
                        <br />
                        {provider.city}, {provider.state} {provider.zip}
                      </Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </Paper>

            <Alert severity="info" sx={{ mt: 2 }}>
              Please review all details carefully before confirming your appointment.
            </Alert>
          </Box>
        )}

        {/* Step 4: Confirmation */}
        {activeStep === 4 && appointment && (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Appointment Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your appointment has been successfully booked.
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 3,
                bgcolor: 'primary.50',
                borderColor: 'primary.main',
              }}
            >
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Confirmation Number
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {appointment.confirmationNumber}
                </Typography>
                <IconButton
                  onClick={copyConfirmationNumber}
                  size="small"
                  color="primary"
                  title="Copy confirmation number"
                >
                  <ContentCopy />
                </IconButton>
              </Box>
              {copied && (
                <Typography variant="caption" color="success.main" sx={{ mt: 1 }}>
                  ✓ Copied to clipboard
                </Typography>
              )}
            </Paper>

            <Stack spacing={2} sx={{ textAlign: 'left' }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Appointment Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Provider:</strong> {provider.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Date:</strong> {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Time:</strong> {selectedTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Type:</strong> {visitType === 'telehealth' ? 'Telemedicine' : 'In-Person'}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={<CalendarToday />}
                onClick={addToCalendar}
                fullWidth
                sx={{ minHeight: 44 }}
              >
                Add to Calendar
              </Button>

              <Alert severity="success">
                A confirmation email has been sent to your registered email address with all appointment details.
              </Alert>
            </Stack>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        {activeStep < steps.length - 1 ? (
          <>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Box>
              <Button onClick={handleBack} disabled={activeStep === 0 || loading} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid() || loading}
              >
                {activeStep === steps.length - 2 ? 'Confirm Booking' : 'Next'}
              </Button>
            </Box>
          </>
        ) : (
          <Button variant="contained" onClick={handleClose} fullWidth>
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;
