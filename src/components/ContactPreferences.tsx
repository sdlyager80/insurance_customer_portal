import { useState, useEffect } from 'react';
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
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="600">
          Contact Preferences
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Update your contact information and communication preferences
        </Typography>
      </DialogTitle>

      <DialogContent>
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
              <Typography variant="subtitle2" fontWeight="600">
                No contact preferences set
              </Typography>
              <Typography variant="body2">
                Please add your contact information below to ensure we can reach you when needed.
              </Typography>
            </Alert>
          )}

          {/* Contact Information Section */}
          <Box>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Contact Information
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {/* Primary Email (read-only) */}
              <Box>
                <Typography variant="body2" fontWeight="600" gutterBottom>
                  Primary Email
                </Typography>
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
                <Typography variant="body2" fontWeight="600" gutterBottom>
                  Alternate Email
                </Typography>
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
                <Typography variant="body2" fontWeight="600" gutterBottom>
                  Work Phone
                </Typography>
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
                <Typography variant="body2" fontWeight="600" gutterBottom>
                  Mobile Phone
                </Typography>
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
                <Typography variant="body2" fontWeight="600" gutterBottom>
                  Availability Notes
                </Typography>
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
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Preferred Communication Methods
            </Typography>

            <Stack spacing={1} sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.preferredMethods.email}
                    onChange={() => handleMethodToggle('email')}
                  />
                }
                label="Email"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.preferredMethods.phone}
                    onChange={() => handleMethodToggle('phone')}
                  />
                }
                label="Phone Call"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.preferredMethods.text}
                    onChange={() => handleMethodToggle('text')}
                  />
                }
                label="Text/SMS"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.preferredMethods.portal}
                    onChange={() => handleMethodToggle('portal')}
                  />
                }
                label="Portal Notifications"
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!hasChanges || Object.keys(validationErrors).length > 0}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactPreferences;
