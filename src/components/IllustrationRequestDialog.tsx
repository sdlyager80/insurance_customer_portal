import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  Stack,
  Slider,
  InputAdornment,
  Alert,
} from '@mui/material';
import { RequestQuote, Info } from '@mui/icons-material';
import type { Policy } from '../types/policy';

interface IllustrationRequestDialogProps {
  open: boolean;
  onClose: () => void;
  policy: Policy;
  onSubmit: (requestData: {
    requestType: string;
    scenarioType: string;
    projectionYears: number;
    additionalPremium: number;
    notes: string;
  }) => void;
}

const IllustrationRequestDialog = ({
  open,
  onClose,
  policy,
  onSubmit,
}: IllustrationRequestDialogProps) => {
  const [requestType, setRequestType] = useState<'inforce' | 'policy_change' | 'quote'>('inforce');
  const [scenarioType, setScenarioType] = useState<'guaranteed' | 'illustrated' | 'custom'>('illustrated');
  const [projectionYears, setProjectionYears] = useState(30);
  const [additionalPremium, setAdditionalPremium] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onSubmit({
      requestType,
      scenarioType,
      projectionYears,
      additionalPremium,
      notes,
    });
    onClose();
  };

  const handleReset = () => {
    setRequestType('inforce');
    setScenarioType('illustrated');
    setProjectionYears(30);
    setAdditionalPremium(0);
    setNotes('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <RequestQuote sx={{ fontSize: 32, color: '#1B75BB' }} />
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ fontFamily: '"Roboto Slab", serif' }}>
              Request Policy Illustration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {policy.productName} • {policy.policyNumber}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <Alert severity="info" icon={<Info />}>
            An illustration shows projected policy values based on current and assumed future conditions.
            Processing typically takes 1-2 business days.
          </Alert>

          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
              Illustration Type
            </FormLabel>
            <RadioGroup
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as any)}
            >
              <FormControlLabel
                value="inforce"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      In-Force Illustration
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Shows current policy performance and future projections
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="policy_change"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Policy Change Illustration
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Model the impact of changes like premium increases or benefit adjustments
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="quote"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      New Coverage Quote
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Explore additional coverage options or riders
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
              Interest Rate Scenario
            </FormLabel>
            <RadioGroup
              value={scenarioType}
              onChange={(e) => setScenarioType(e.target.value as any)}
            >
              <FormControlLabel
                value="guaranteed"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Guaranteed Values Only
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Conservative projection using minimum guaranteed interest rates
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="illustrated"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Current Illustrated Rate
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Uses current interest rate assumptions (not guaranteed)
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="custom"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Custom Scenario
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Specify custom assumptions for comparison
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>

          <Box>
            <FormLabel sx={{ fontWeight: 600, mb: 2, display: 'block' }}>
              Projection Period: {projectionYears} years
            </FormLabel>
            <Slider
              value={projectionYears}
              onChange={(_, value) => setProjectionYears(value as number)}
              min={10}
              max={50}
              step={5}
              marks
              valueLabelDisplay="auto"
              sx={{
                '& .MuiSlider-thumb': {
                  backgroundColor: '#1B75BB',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#1B75BB',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#E0E0E0',
                },
              }}
            />
          </Box>

          {requestType === 'policy_change' && (
            <TextField
              label="Additional Annual Premium"
              type="number"
              value={additionalPremium}
              onChange={(e) => setAdditionalPremium(Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="Enter any additional premium you'd like to model"
              fullWidth
            />
          )}

          <TextField
            label="Additional Notes (Optional)"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any specific questions or scenarios you'd like included..."
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={handleReset} color="inherit">
          Reset
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<RequestQuote />}
          sx={{
            bgcolor: '#1B75BB',
            '&:hover': {
              bgcolor: '#00ADEE',
            },
          }}
        >
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IllustrationRequestDialog;
