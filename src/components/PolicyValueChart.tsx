import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Stack,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import { TrendingUp, ShowChart } from '@mui/icons-material';

interface PolicyValueData {
  year: number;
  age: number;
  accountValue: number;
  cashValue: number;
  deathBenefit: number;
  premiumsPaid: number;
  guaranteedValue?: number;
}

interface PolicyValueChartProps {
  policyType: 'life' | 'annuity';
  data: PolicyValueData[];
  productName: string;
}

const PolicyValueChart = ({ data, productName }: PolicyValueChartProps) => {
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'accountValue',
    'cashValue',
    'deathBenefit',
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as PolicyValueData;
      return (
        <Paper
          elevation={8}
          sx={{
            p: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Year {label} • Age {dataPoint.age}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: entry.color,
                }}
              />
              <Typography variant="body2" sx={{ flex: 1 }}>
                {entry.name}:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(entry.value)}
              </Typography>
            </Box>
          ))}
          {dataPoint.premiumsPaid && (
            <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary">
                Total Premiums Paid: {formatCurrency(dataPoint.premiumsPaid)}
              </Typography>
            </Box>
          )}
        </Paper>
      );
    }
    return null;
  };

  const metricConfig = {
    accountValue: {
      label: 'Account Value',
      color: '#1B75BB',
      strokeWidth: 3,
    },
    cashValue: {
      label: 'Cash Surrender Value',
      color: '#8BC53F',
      strokeWidth: 2,
    },
    deathBenefit: {
      label: 'Death Benefit',
      color: '#D02E2E',
      strokeWidth: 2,
    },
    guaranteedValue: {
      label: 'Guaranteed Value',
      color: '#F6921E',
      strokeWidth: 2,
      strokeDasharray: '5 5',
    },
  };

  const currentValue = data[data.length - 1];
  const startValue = data[0];
  const totalGrowth = currentValue.accountValue - startValue.accountValue;
  const growthPercentage = ((totalGrowth / startValue.accountValue) * 100).toFixed(1);

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: '#FFFFFF',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          bgcolor: 'rgba(27, 117, 187, 0.04)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
        }}>
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Policy Value Projection
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {productName} • {data.length} Year Projection
            </Typography>
          </Box>

          {/* Chart Type Toggle */}
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(_, newType) => newType && setChartType(newType)}
            size="small"
            sx={{
              width: { xs: '100%', sm: 'auto' },
              '& .MuiToggleButton-root': {
                flex: { xs: 1, sm: 'initial' },
                minHeight: 44,
              },
            }}
          >
            <ToggleButton value="area">
              <ShowChart fontSize="small" />
            </ToggleButton>
            <ToggleButton value="line">
              <TrendingUp fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Key Metrics */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 3 }}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Current Value
            </Typography>
            <Typography variant="h5" fontWeight={700} color="#000000">
              {formatCurrency(currentValue.accountValue)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Total Growth
            </Typography>
            <Typography variant="h5" fontWeight={700} color="#000000">
              {formatCurrency(totalGrowth)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Growth Rate
            </Typography>
            <Typography variant="h5" fontWeight={700} color="#000000">
              +{growthPercentage}%
            </Typography>
          </Box>
        </Stack>

        {/* Metric Selection Chips */}
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {Object.entries(metricConfig).map(([key, config]) => {
            // Don't show guaranteed value if not in data
            if (key === 'guaranteedValue' && !data[0].guaranteedValue) return null;

            return (
              <Chip
                key={key}
                label={config.label}
                onClick={() => toggleMetric(key)}
                sx={{
                  bgcolor: selectedMetrics.includes(key) ? `${config.color}20` : 'transparent',
                  border: '1.5px solid',
                  borderColor: selectedMetrics.includes(key) ? config.color : 'divider',
                  color: '#000000',
                  fontWeight: selectedMetrics.includes(key) ? 600 : 400,
                  '&:hover': {
                    bgcolor: `${config.color}30`,
                    borderColor: config.color,
                  },
                  transition: 'all 0.2s ease',
                }}
                size="small"
              />
            );
          })}
        </Stack>
      </Box>

      {/* Chart */}
      <Box sx={{
        width: '100%',
        height: { xs: 300, sm: 350, md: 400 },
        mt: { xs: 2, sm: 0 },
      }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 10
              }}
            >
              <defs>
                {Object.entries(metricConfig).map(([key, config]) => (
                  <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={config.color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={config.color} stopOpacity={0.2} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="year"
                label={{ value: 'Policy Year', position: 'insideBottom', offset: -5 }}
                stroke="#666"
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              {selectedMetrics.includes('accountValue') && (
                <Area
                  type="monotone"
                  dataKey="accountValue"
                  name="Account Value"
                  stroke={metricConfig.accountValue.color}
                  strokeWidth={metricConfig.accountValue.strokeWidth}
                  fill={`url(#coloraccountValue)`}
                  animationDuration={1500}
                  animationBegin={0}
                />
              )}
              {selectedMetrics.includes('cashValue') && (
                <Area
                  type="monotone"
                  dataKey="cashValue"
                  name="Cash Surrender Value"
                  stroke={metricConfig.cashValue.color}
                  strokeWidth={metricConfig.cashValue.strokeWidth}
                  fill={`url(#colorcashValue)`}
                  animationDuration={1500}
                  animationBegin={200}
                />
              )}
              {selectedMetrics.includes('deathBenefit') && (
                <Area
                  type="monotone"
                  dataKey="deathBenefit"
                  name="Death Benefit"
                  stroke={metricConfig.deathBenefit.color}
                  strokeWidth={metricConfig.deathBenefit.strokeWidth}
                  fill={`url(#colordeathBenefit)`}
                  animationDuration={1500}
                  animationBegin={400}
                />
              )}
              {selectedMetrics.includes('guaranteedValue') && data[0].guaranteedValue && (
                <Area
                  type="monotone"
                  dataKey="guaranteedValue"
                  name="Guaranteed Value"
                  stroke={metricConfig.guaranteedValue.color}
                  strokeWidth={metricConfig.guaranteedValue.strokeWidth}
                  strokeDasharray={metricConfig.guaranteedValue.strokeDasharray}
                  fill={`url(#colorguaranteedValue)`}
                  animationDuration={1500}
                  animationBegin={600}
                />
              )}
            </AreaChart>
          ) : (
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 10
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="year"
                label={{ value: 'Policy Year', position: 'insideBottom', offset: -5 }}
                stroke="#666"
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              {selectedMetrics.includes('accountValue') && (
                <Line
                  type="monotone"
                  dataKey="accountValue"
                  name="Account Value"
                  stroke={metricConfig.accountValue.color}
                  strokeWidth={metricConfig.accountValue.strokeWidth}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                  animationBegin={0}
                />
              )}
              {selectedMetrics.includes('cashValue') && (
                <Line
                  type="monotone"
                  dataKey="cashValue"
                  name="Cash Surrender Value"
                  stroke={metricConfig.cashValue.color}
                  strokeWidth={metricConfig.cashValue.strokeWidth}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                  animationBegin={200}
                />
              )}
              {selectedMetrics.includes('deathBenefit') && (
                <Line
                  type="monotone"
                  dataKey="deathBenefit"
                  name="Death Benefit"
                  stroke={metricConfig.deathBenefit.color}
                  strokeWidth={metricConfig.deathBenefit.strokeWidth}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                  animationBegin={400}
                />
              )}
              {selectedMetrics.includes('guaranteedValue') && data[0].guaranteedValue && (
                <Line
                  type="monotone"
                  dataKey="guaranteedValue"
                  name="Guaranteed Value"
                  stroke={metricConfig.guaranteedValue.color}
                  strokeWidth={metricConfig.guaranteedValue.strokeWidth}
                  strokeDasharray={metricConfig.guaranteedValue.strokeDasharray}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                  animationBegin={600}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </Box>

      {/* Footer Note */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, fontStyle: 'italic' }}>
        * Projected values are based on current assumptions and are not guaranteed. Actual results may vary.
      </Typography>
    </Paper>
  );
};

export default PolicyValueChart;
