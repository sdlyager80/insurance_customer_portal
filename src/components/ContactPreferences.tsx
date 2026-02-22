import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import { Lock } from '@mui/icons-material';

interface ContactPreferencesData {
  phone: string;
  mobile: string;
  alternateEmail: string;
  preferredMethods: {
    email: boolean;
    phone: boolean;
    text: boolean;
    portal: boolean;
  };
  availability: string;
}

interface ContactPreferencesProps {
  open: boolean;
  onClose: () => void;
  userEmail?: string;
}

const ContactPreferences = ({ open, onClose, userEmail = 'customer@example.com' }: ContactPreferencesProps) => {
  // Initialize preferences from localStorage or with empty defaults
  const [preferences, setPreferences] = useState<ContactPreferencesData>(() => {
    const saved = localStorage.getItem('contactPreferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          phone: '',
          mobile: '',
          alternateEmail: '',
          preferredMethods: {
            email: true,
            phone: false,
            text: false,
            portal: true,
          },
          availability: '',
        };
      }
    }
    return {
      phone: '',
      mobile: '',
      alternateEmail: '',
      preferredMethods: {
        email: true,
        phone: false,
        text: false,
        portal: true,
      },
      availability: '',
    };
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem('contactPreferences');
      if (saved) {
        try {
          setPreferences(JSON.parse(saved));
        } catch {
          // Keep current state
        }
      }
      setHasChanges(false);
      setValidationErrors({});
      setShowSuccessAlert(false);
    }
  }, [open]);

  const validatePhone = (phone: string) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string) => {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: keyof Omit<ContactPreferencesData, 'preferredMethods'>, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleMethodToggle = (method: keyof ContactPreferencesData['preferredMethods']) => {
    setPreferences((prev) => ({
      ...prev,
      preferredMethods: {
        ...prev.preferredMethods,
        [method]: !prev.preferredMethods[method],
      },
    }));
    setHasChanges(true);
    if (validationErrors.methods) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.methods;
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    // Validate inputs
    const errors: Record<string, string> = {};

    if (preferences.phone && !validatePhone(preferences.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    if (preferences.mobile && !validatePhone(preferences.mobile)) {
      errors.mobile = 'Invalid mobile number format';
    }

    if (preferences.alternateEmail && !validateEmail(preferences.alternateEmail)) {
      errors.alternateEmail = 'Invalid email format';
    }

    if (!Object.values(preferences.preferredMethods).some((v) => v)) {
      errors.methods = 'Please select at least one communication method';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Save to localStorage
    localStorage.setItem('contactPreferences', JSON.stringify(preferences));

    setShowSuccessAlert(true);
    setHasChanges(false);

    // Close dialog after brief delay
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmed) return;
    }
    onClose();
  };

  const isEmpty = !preferences.phone && !preferences.mobile && !preferences.alternateEmail;

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      TransitionProps={{
        onEntered: () => {
          if (dialogContentRef.current) {
            dialogContentRef.current.scrollTop = 0;
          }
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight={600}>
          Contact Preferences
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Update your contact information and communication preferences
        </Typography>
      </DialogTitle>

      <DialogContent ref={dialogContentRef}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Success Alert */}
          {showSuccessAlert && (
            <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>
              Contact preferences updated successfully!
            </Alert>
          )}

          {/* Empty State Alert */}
          {isEmpty && !showSuccessAlert && (
            <Alert severity="info" icon={<span>ℹ️</span>}>
              <Typography variant="subtitle2" fontWeight={600}>
                No contact preferences set
              </Typography>
              <Typography variant="body2">
                Please add your contact information below to ensure we can reach you when needed.
              </Typography>
            </Alert>
          )}

          {/* Contact Information Section */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Contact Information
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {/* Primary Email (read-only) */}
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'rgba(0,0,0,0.04)',
                  borderRadius: 1.5,
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                  <Lock sx={{ fontSize: 14, color: '#808285' }} />
                  <Typography variant="body2" fontWeight={600}>
                    Primary Email
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#808285', ml: 'auto', fontStyle: 'italic' }}>
                    Read-only
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  value={userEmail}
                  disabled
                  size="small"
                  helperText="Primary email cannot be changed here"
                />
              </Box>

              {/* Alternate Email */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600}>Alternate Email</Typography>
                  <Typography variant="caption" sx={{ color: '#808285' }}>(Optional)</Typography>
                </Box>
                <TextField
                  fullWidth
                  value={preferences.alternateEmail}
                  onChange={(e) => handleInputChange('alternateEmail', e.target.value)}
                  placeholder="alternate.email@example.com"
                  size="small"
                  error={!!validationErrors.alternateEmail}
                  helperText={validationErrors.alternateEmail}
                />
              </Box>

              {/* Phone */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600}>Work Phone</Typography>
                  <Typography variant="caption" sx={{ color: '#808285' }}>(Optional)</Typography>
                </Box>
                <TextField
                  fullWidth
                  value={preferences.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  size="small"
                  error={!!validationErrors.phone}
                  helperText={validationErrors.phone}
                />
              </Box>

              {/* Mobile */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600}>Mobile Phone</Typography>
                  <Typography variant="caption" sx={{ color: '#808285' }}>(Optional)</Typography>
                </Box>
                <TextField
                  fullWidth
                  value={preferences.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder="(555) 987-6543"
                  size="small"
                  error={!!validationErrors.mobile}
                  helperText={validationErrors.mobile}
                />
              </Box>

              {/* Availability */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600}>Availability Notes</Typography>
                  <Typography variant="caption" sx={{ color: '#808285' }}>(Optional)</Typography>
                </Box>
                <TextField
                  fullWidth
                  value={preferences.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  placeholder="e.g., Available Mon-Fri 9am-5pm EST"
                  size="small"
                />
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Preferred Communication Methods */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Preferred Communication Methods
              </Typography>
              <Typography sx={{ color: '#D02E2E', fontWeight: 700, lineHeight: 1.2 }}>*</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#808285' }}>
              Select at least one method
            </Typography>

            {validationErrors.methods && (
              <Alert severity="error" sx={{ mt: 1, py: 0.5 }}>
                {validationErrors.methods}
              </Alert>
            )}

            <Stack spacing={1} sx={{ mt: 1.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.preferredMethods.email}
                    onChange={() => handleMethodToggle('email')}
                    sx={{ color: '#808285', '&.Mui-checked': { color: '#1B75BB' } }}
                  />
                }
                label="Email"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.preferredMethods.phone}
                    onChange={() => handleMethodToggle('phone')}
                    sx={{ color: '#808285', '&.Mui-checked': { color: '#1B75BB' } }}
                  />
                }
                label="Phone Call"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.preferredMethods.text}
                    onChange={() => handleMethodToggle('text')}
                    sx={{ color: '#808285', '&.Mui-checked': { color: '#1B75BB' } }}
                  />
                }
                label="Text/SMS"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.preferredMethods.portal}
                    onChange={() => handleMethodToggle('portal')}
                    sx={{ color: '#808285', '&.Mui-checked': { color: '#1B75BB' } }}
                  />
                }
                label="Portal Notifications"
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} sx={{ color: '#1B75BB' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={Object.keys(validationErrors).length > 0}
          sx={{ bgcolor: '#1B75BB', '&:hover': { bgcolor: '#155f99' } }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactPreferences;
