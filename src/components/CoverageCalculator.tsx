import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import {
  Box,
  Paper,
  Typography,
  Slider,
  TextField,
  Button,
  Stack,
  Chip,
  Divider,
  InputAdornment,
  Alert,
  LinearProgress,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Calculate,
  TrendingUp,
  Home,
  School,
  AttachMoney,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CoverageCalculatorProps {
  currentCoverage?: number;
  onRecommendationAccept?: (amount: number) => void;
}

const CoverageCalculator = ({ currentCoverage = 0, onRecommendationAccept }: CoverageCalculatorProps) => {
  const [expanded, setExpanded] = useState(true);

  // Input values
  const [annualIncome, setAnnualIncome] = useState(75000);
  const [incomeYears, setIncomeYears] = useState(10);
  const [mortgageBalance, setMortgageBalance] = useState(250000);
  const [otherDebts, setOtherDebts] = useState(25000);
  const [childrenCount, setChildrenCount] = useState(2);
  const [educationPerChild, setEducationPerChild] = useState(50000);
  const [finalExpenses, setFinalExpenses] = useState(15000);
  const [emergencyFund, setEmergencyFund] = useState(30000);
  const [existingSavings, setExistingSavings] = useState(50000);

  // Calculate coverage needs
  const incomeReplacement = annualIncome * incomeYears;
  const debtCoverage = mortgageBalance + otherDebts;
  const educationFunding = childrenCount * educationPerChild;
  const totalNeeds = incomeReplacement + debtCoverage + educationFunding + finalExpenses + emergencyFund;
  const recommendedCoverage = Math.max(0, totalNeeds - existingSavings);

  // Coverage gap analysis
  const coverageGap = recommendedCoverage - currentCoverage;
  const isUnderinsured = coverageGap > 0;
  const coveragePercentage = currentCoverage > 0 ? (currentCoverage / recommendedCoverage) * 100 : 0;

  // Pie chart data
  const chartData = [
    { name: 'Income Replacement', value: incomeReplacement, color: '#1B75BB' },
    { name: 'Debt Coverage', value: debtCoverage, color: '#D02E2E' },
    { name: 'Education Fund', value: educationFunding, color: '#8BC53F' },
    { name: 'Final Expenses', value: finalExpenses, color: '#F6921E' },
    { name: 'Emergency Fund', value: emergencyFund, color: '#00ADEE' },
  ].filter(item => item.value > 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={4} sx={{ p: 1.5 }}>
          <Typography variant="body2" fontWeight={600}>
            {payload[0].name}
          </Typography>
          <Typography variant="h6" color="#000000">
            {formatCurrency(payload[0].value)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {((payload[0].value / totalNeeds) * 100).toFixed(1)}% of total
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: '#1B75BB',
          p: 3,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Calculate sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Coverage Calculator
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Calculate your life insurance needs
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ color: 'white' }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* Results Summary */}
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          <Box sx={{ p: 2.5, bgcolor: 'white', borderRadius: 2, borderLeft: '4px solid #37A526', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <TrendingUp sx={{ fontSize: 15, color: '#37A526' }} />
              <Typography variant="caption" sx={{ color: '#808285', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Recommended Coverage
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color="#000000">
              {formatCurrency(recommendedCoverage)}
            </Typography>
            <Typography variant="caption" sx={{ color: '#808285', display: 'block', mt: 0.5 }}>
              Total needs: {formatCurrency(totalNeeds)}
            </Typography>
          </Box>

          <Box sx={{ p: 2.5, bgcolor: 'white', borderRadius: 2, borderLeft: '4px solid #00ADEE', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <CheckCircle sx={{ fontSize: 15, color: '#00ADEE' }} />
              <Typography variant="caption" sx={{ color: '#808285', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Current Coverage
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color="#000000">
              {formatCurrency(currentCoverage)}
            </Typography>
          </Box>

          <Box sx={{
            p: 2.5, bgcolor: 'white', borderRadius: 2,
            borderLeft: `4px solid ${isUnderinsured ? '#D02E2E' : '#37A526'}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              {isUnderinsured
                ? <Warning sx={{ fontSize: 15, color: '#D02E2E' }} />
                : <CheckCircle sx={{ fontSize: 15, color: '#37A526' }} />
              }
              <Typography variant="caption" sx={{ color: '#808285', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {isUnderinsured ? 'Coverage Gap' : 'Coverage Status'}
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color="#000000">
              {isUnderinsured ? formatCurrency(coverageGap) : '✓ Covered'}
            </Typography>
          </Box>
        </Box>

        {/* Coverage Progress Bar */}
        {currentCoverage > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Coverage Progress
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {Math.min(coveragePercentage, 100).toFixed(0)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(coveragePercentage, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: isUnderinsured ? '#F6921E' : '#8BC53F',
                },
              }}
            />
          </Box>
        )}
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 3 }}>
          {/* Disclaimer */}
          <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600}>
              For Demonstration Purposes Only
            </Typography>
            <Typography variant="caption">
              The numbers and calculations shown are for illustrative purposes to demonstrate functionality.
              Please consult with a licensed insurance professional for accurate coverage recommendations.
            </Typography>
          </Alert>

          {/* Alert */}
          {isUnderinsured && currentCoverage > 0 && (
            <Alert
              severity="warning"
              icon={<Warning />}
              sx={{ mb: 3 }}
              action={
                onRecommendationAccept && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => onRecommendationAccept(recommendedCoverage)}
                  >
                    Get Quote
                  </Button>
                )
              }
            >
              <Typography variant="body2" fontWeight={600}>
                You may be underinsured by {formatCurrency(coverageGap)}
              </Typography>
              <Typography variant="caption">
                Consider increasing your coverage to protect your family's financial future
              </Typography>
            </Alert>
          )}

          {currentCoverage === 0 && (
            <Alert severity="info" icon={<CheckCircle />} sx={{ mb: 3 }}>
              <Typography variant="body2">
                Based on your inputs, we recommend {formatCurrency(recommendedCoverage)} in coverage
              </Typography>
            </Alert>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' }, gap: 4 }}>
            {/* Input Controls */}
            <Stack spacing={3}>
              {/* Income Replacement */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUp color="primary" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Income Replacement
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <TextField
                    label="Annual Income"
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    size="small"
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Years of Income to Replace: {incomeYears} years
                    </Typography>
                    <Slider
                      value={incomeYears}
                      onChange={(_, v) => setIncomeYears(v as number)}
                      min={1}
                      max={30}
                      marks={[
                        { value: 1, label: '1' },
                        { value: 10, label: '10' },
                        { value: 20, label: '20' },
                        { value: 30, label: '30' },
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  <Chip
                    label={`Total: ${formatCurrency(incomeReplacement)}`}
                    sx={{ bgcolor: '#1B75BB1A', border: '1px solid #1B75BB4D', color: '#000000', fontWeight: 600 }}
                  />
                </Stack>
              </Box>

              <Divider />

              {/* Debt Coverage */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Home color="error" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Debt Coverage
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <TextField
                    label="Mortgage Balance"
                    type="number"
                    value={mortgageBalance}
                    onChange={(e) => setMortgageBalance(Number(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    size="small"
                  />
                  <TextField
                    label="Other Debts (loans, credit cards)"
                    type="number"
                    value={otherDebts}
                    onChange={(e) => setOtherDebts(Number(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    size="small"
                  />
                  <Chip
                    label={`Total: ${formatCurrency(debtCoverage)}`}
                    sx={{ bgcolor: '#D02E2E1A', border: '1px solid #D02E2E4D', color: '#000000', fontWeight: 600 }}
                  />
                </Stack>
              </Box>

              <Divider />

              {/* Education Funding */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <School sx={{ color: '#8BC53F' }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Education Funding
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Number of Children: {childrenCount}
                    </Typography>
                    <Slider
                      value={childrenCount}
                      onChange={(_, v) => setChildrenCount(v as number)}
                      min={0}
                      max={5}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  <TextField
                    label="Education Cost per Child"
                    type="number"
                    value={educationPerChild}
                    onChange={(e) => setEducationPerChild(Number(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    size="small"
                  />
                  <Chip
                    label={`Total: ${formatCurrency(educationFunding)}`}
                    sx={{ bgcolor: '#8BC53F1A', border: '1px solid #8BC53F4D', color: '#000000', fontWeight: 600 }}
                  />
                </Stack>
              </Box>

              <Divider />

              {/* Other Needs */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AttachMoney sx={{ color: '#F6921E' }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Other Needs
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <TextField
                    label="Final Expenses (funeral, etc.)"
                    type="number"
                    value={finalExpenses}
                    onChange={(e) => setFinalExpenses(Number(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    size="small"
                  />
                  <TextField
                    label="Emergency Fund"
                    type="number"
                    value={emergencyFund}
                    onChange={(e) => setEmergencyFund(Number(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    size="small"
                  />
                  <TextField
                    label="Existing Savings / Assets"
                    type="number"
                    value={existingSavings}
                    onChange={(e) => setExistingSavings(Number(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    size="small"
                    helperText="We'll subtract this from your total need"
                  />
                </Stack>
              </Box>
            </Stack>

            {/* Visualization */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  position: 'sticky',
                  top: 100,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Coverage Breakdown
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value: string) => (
                          <span style={{ fontSize: '12px' }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Summary */}
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Needs:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(totalNeeds)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Existing Assets:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      -{formatCurrency(existingSavings)}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight={700}>
                      Recommended Coverage:
                    </Typography>
                    <Typography variant="body1" fontWeight={700} color="#000000">
                      {formatCurrency(recommendedCoverage)}
                    </Typography>
                  </Box>
                </Stack>

                {onRecommendationAccept && (
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 2, bgcolor: '#1B75BB', '&:hover': { bgcolor: '#155f99' } }}
                    onClick={() => onRecommendationAccept(recommendedCoverage)}
                  >
                    Get a Quote
                  </Button>
                )}
              </Paper>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default CoverageCalculator;
