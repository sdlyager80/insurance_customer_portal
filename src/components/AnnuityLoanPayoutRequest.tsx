import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Stack,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputAdornment,
  Slider,
} from '@mui/material';
import {
  TrendingDown,
  TrendingUp,
  AccountBalance,
  Warning,
  InfoOutlined,
} from '@mui/icons-material';

interface AnnuityData {
  policyNumber: string;
  productName: string;
  currentValue: number;
  cashSurrenderValue: number;
  loanBalance: number;
  maxLoanAmount: number;
  surrenderChargePercent: number;
  surrenderChargeYearsRemaining: number;
  annualGrowthRate: number; // Expected annual return
  age: number;
}

interface AnnuityLoanPayoutRequestProps {
  open: boolean;
  onClose: () => void;
  annuityData: AnnuityData;
  onSubmit: (requestData: any) => void;
}

const AnnuityLoanPayoutRequest = ({
  open,
  onClose,
  annuityData,
  onSubmit,
}: AnnuityLoanPayoutRequestProps) => {
  const [requestType, setRequestType] = useState<'loan' | 'withdrawal'>('withdrawal');
  const [amount, setAmount] = useState<number>(0);
  const [frequency, setFrequency] = useState<'one-time' | 'systematic'>('one-time');
  const [systematicAmount, setSystematicAmount] = useState<number>(500);
  const [systematicFrequency, setSystematicFrequency] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [tabValue, setTabValue] = useState(0);
  const [projectionYears, setProjectionYears] = useState(10);

  // Calculate illustration data
  const illustration = useMemo(() => {
    const requestAmount = frequency === 'one-time' ? amount : 0;
    const isSurrenderCharge = annuityData.surrenderChargeYearsRemaining > 0;
    const surrenderCharge = isSurrenderCharge ? requestAmount * (annuityData.surrenderChargePercent / 100) : 0;

    // Tax implications (simplified - assume 10% early withdrawal penalty if under 59.5)
    const isEarlyWithdrawal = annuityData.age < 59.5 && requestType === 'withdrawal';
    const earlyWithdrawalPenalty = isEarlyWithdrawal ? requestAmount * 0.10 : 0;

    // Estimated income tax (simplified - assume 22% federal tax bracket)
    const estimatedIncomeTax = requestType === 'withdrawal' ? requestAmount * 0.22 : 0;

    // Net amount received
    const totalDeductions = surrenderCharge + earlyWithdrawalPenalty + (requestType === 'withdrawal' ? estimatedIncomeTax : 0);
    const netAmountReceived = requestAmount - totalDeductions;

    // Remaining value
    const remainingValue = requestType === 'loan'
      ? annuityData.currentValue // Loans don't reduce account value initially
      : annuityData.currentValue - requestAmount;

    // Loan interest (simplified - assume 5% annual)
    const loanInterest = requestType === 'loan' ? requestAmount * 0.05 : 0;

    // Future projections
    const projections = [];
    let currentVal = remainingValue;
    let systematicWithdrawals = 0;

    for (let year = 1; year <= projectionYears; year++) {
      // Calculate systematic withdrawals for the year
      if (frequency === 'systematic') {
        if (systematicFrequency === 'monthly') {
          systematicWithdrawals = systematicAmount * 12;
        } else if (systematicFrequency === 'quarterly') {
          systematicWithdrawals = systematicAmount * 4;
        } else {
          systematicWithdrawals = systematicAmount;
        }
      }

      // Apply growth
      currentVal = currentVal * (1 + annuityData.annualGrowthRate / 100);

      // Subtract systematic withdrawals
      currentVal = currentVal - systematicWithdrawals;

      // Ensure value doesn't go negative
      if (currentVal < 0) currentVal = 0;

      projections.push({
        year,
        value: currentVal,
        withdrawals: systematicWithdrawals,
      });
    }

    // Calculate loan impact if applicable
    const loanImpact = requestType === 'loan' ? {
      outstandingBalance: requestAmount + (loanInterest * projectionYears),
      annualInterest: loanInterest,
      reducedDeathBenefit: requestAmount + (loanInterest * projectionYears),
    } : null;

    return {
      requestAmount,
      surrenderCharge,
      earlyWithdrawalPenalty,
      estimatedIncomeTax,
      totalDeductions,
      netAmountReceived,
      remainingValue,
      loanImpact,
      projections,
      isSurrenderCharge,
      isEarlyWithdrawal,
    };
  }, [amount, requestType, frequency, systematicAmount, systematicFrequency, projectionYears, annuityData]);

  const handleSubmit = () => {
    const requestData = {
      requestType,
      amount: frequency === 'one-time' ? amount : systematicAmount,
      frequency,
      systematicFrequency: frequency === 'systematic' ? systematicFrequency : null,
      policyNumber: annuityData.policyNumber,
      illustration,
      requestDate: new Date().toISOString(),
    };

    onSubmit(requestData);
    onClose();
  };

  const maxAmount = requestType === 'loan'
    ? annuityData.maxLoanAmount - annuityData.loanBalance
    : annuityData.cashSurrenderValue;

  const isValidAmount = amount > 0 && amount <= maxAmount;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: '90vh' },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="600">
          Annuity Loan or Withdrawal Request
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {annuityData.productName} - {annuityData.policyNumber}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Request Details" />
          <Tab label="Impact Illustration" />
        </Tabs>

        {/* Tab 1: Request Details */}
        {tabValue === 0 && (
          <Stack spacing={3}>
            {/* Current Account Summary */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', border: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Current Account Summary
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Account Value
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    ${annuityData.currentValue.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cash Surrender Value
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    ${annuityData.cashSurrenderValue.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Current Loan Balance
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    ${annuityData.loanBalance.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Available Loan Amount
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    ${(annuityData.maxLoanAmount - annuityData.loanBalance).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Request Type */}
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                Request Type
              </FormLabel>
              <RadioGroup
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as 'loan' | 'withdrawal')}
              >
                <FormControlLabel
                  value="withdrawal"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        Withdrawal (Surrender)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Permanently remove funds from your annuity
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="loan"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        Loan
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Borrow against your annuity value (subject to interest)
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            {/* Frequency */}
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                Payment Frequency
              </FormLabel>
              <RadioGroup
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as 'one-time' | 'systematic')}
              >
                <FormControlLabel
                  value="one-time"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        One-Time Payment
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Receive a single lump sum payment
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="systematic"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        Systematic Withdrawals
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Set up recurring payments from your annuity
                      </Typography>
                    </Box>
                  }
                  disabled={requestType === 'loan'}
                />
              </RadioGroup>
            </FormControl>

            {/* Amount */}
            {frequency === 'one-time' ? (
              <Box>
                <FormLabel sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Amount
                </FormLabel>
                <TextField
                  fullWidth
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  helperText={`Maximum available: $${maxAmount.toLocaleString()}`}
                  error={amount > maxAmount}
                />
                <Slider
                  value={amount}
                  onChange={(_, v) => setAmount(v as number)}
                  min={0}
                  max={maxAmount}
                  step={100}
                  sx={{ mt: 2 }}
                  marks={[
                    { value: 0, label: '$0' },
                    { value: maxAmount, label: `$${(maxAmount / 1000).toFixed(0)}K` },
                  ]}
                />
              </Box>
            ) : (
              <Box>
                <FormLabel sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Systematic Withdrawal Amount
                </FormLabel>
                <TextField
                  fullWidth
                  type="number"
                  value={systematicAmount}
                  onChange={(e) => setSystematicAmount(Number(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontSize: '0.875rem', mb: 1 }}>
                    Frequency
                  </FormLabel>
                  <RadioGroup
                    row
                    value={systematicFrequency}
                    onChange={(e) => setSystematicFrequency(e.target.value as any)}
                  >
                    <FormControlLabel value="monthly" control={<Radio size="small" />} label="Monthly" />
                    <FormControlLabel value="quarterly" control={<Radio size="small" />} label="Quarterly" />
                    <FormControlLabel value="annual" control={<Radio size="small" />} label="Annual" />
                  </RadioGroup>
                </FormControl>
              </Box>
            )}

            {/* Warnings */}
            {illustration.isSurrenderCharge && (
              <Alert severity="warning" icon={<Warning />}>
                <Typography variant="body2" fontWeight="600">
                  Surrender Charge Applies
                </Typography>
                <Typography variant="caption">
                  A {annuityData.surrenderChargePercent}% surrender charge (${illustration.surrenderCharge.toLocaleString()})
                  will apply. {annuityData.surrenderChargeYearsRemaining} years remaining in surrender period.
                </Typography>
              </Alert>
            )}

            {illustration.isEarlyWithdrawal && (
              <Alert severity="error">
                <Typography variant="body2" fontWeight="600">
                  Early Withdrawal Penalty
                </Typography>
                <Typography variant="caption">
                  A 10% IRS penalty (${illustration.earlyWithdrawalPenalty.toLocaleString()}) applies for
                  withdrawals before age 59½.
                </Typography>
              </Alert>
            )}
          </Stack>
        )}

        {/* Tab 2: Impact Illustration */}
        {tabValue === 1 && (
          <Stack spacing={3}>
            <Alert severity="info" icon={<InfoOutlined />}>
              This illustration is for informational purposes only and is not a guarantee of future performance.
              Actual results may vary based on market conditions and account performance.
            </Alert>

            {/* Summary Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AccountBalance color="primary" fontSize="small" />
                  <Typography variant="caption" fontWeight="600" color="text.secondary">
                    REQUEST AMOUNT
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="700">
                  ${illustration.requestAmount.toLocaleString()}
                </Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <TrendingDown color="error" fontSize="small" />
                  <Typography variant="caption" fontWeight="600" color="text.secondary">
                    TOTAL DEDUCTIONS
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="700" color="#000000">
                  ${illustration.totalDeductions.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Surrender: ${illustration.surrenderCharge.toLocaleString()} •
                  Penalty: ${illustration.earlyWithdrawalPenalty.toLocaleString()} •
                  Tax: ${illustration.estimatedIncomeTax.toLocaleString()}
                </Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: '#37A5264D', bgcolor: '#37A52610' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <TrendingUp sx={{ color: '#37A526' }} fontSize="small" />
                  <Typography variant="caption" fontWeight="600" color="text.secondary">
                    NET AMOUNT RECEIVED
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="700" color="#000000">
                  ${illustration.netAmountReceived.toLocaleString()}
                </Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AccountBalance color="primary" fontSize="small" />
                  <Typography variant="caption" fontWeight="600" color="text.secondary">
                    REMAINING VALUE
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="700">
                  ${illustration.remainingValue.toLocaleString()}
                </Typography>
              </Paper>
            </Box>

            {/* Loan Impact */}
            {requestType === 'loan' && illustration.loanImpact && (
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'warning.50', border: 1, borderColor: 'warning.main' }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  Loan Impact
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mt: 1.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Annual Interest (5%)
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      ${illustration.loanImpact.annualInterest.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Projected Balance ({projectionYears} yrs)
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      ${illustration.loanImpact.outstandingBalance.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Reduced Death Benefit
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      ${illustration.loanImpact.reducedDeathBenefit.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Projection Years Slider */}
            <Box>
              <Typography variant="body2" fontWeight="600" gutterBottom>
                Projection Period: {projectionYears} years
              </Typography>
              <Slider
                value={projectionYears}
                onChange={(_, v) => setProjectionYears(v as number)}
                min={5}
                max={30}
                step={5}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            {/* Future Projections Table */}
            <Box>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Projected Account Value
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', maxHeight: 300 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Year</strong></TableCell>
                      <TableCell align="right"><strong>Account Value</strong></TableCell>
                      {frequency === 'systematic' && (
                        <TableCell align="right"><strong>Annual Withdrawals</strong></TableCell>
                      )}
                      <TableCell align="right"><strong>Growth Rate</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {illustration.projections.map((proj) => (
                      <TableRow key={proj.year}>
                        <TableCell>{proj.year}</TableCell>
                        <TableCell align="right">
                          ${proj.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </TableCell>
                        {frequency === 'systematic' && (
                          <TableCell align="right">
                            ${proj.withdrawals.toLocaleString()}
                          </TableCell>
                        )}
                        <TableCell align="right">
                          <Chip
                            label={`${annuityData.annualGrowthRate}%`}
                            size="small"
                            variant="outlined"
                            sx={{ color: '#000000', borderColor: '#37A5264D', bgcolor: '#37A52620', fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isValidAmount && frequency === 'one-time'}
        >
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnnuityLoanPayoutRequest;
