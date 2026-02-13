import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Print,
  TrendingUp,
  Info,
  Security,
  CalendarToday,
  Person,
  AccountBalance,
} from '@mui/icons-material';
import type { Illustration } from '../types/policy';
import { illustrationApi } from '../services/mockApi';

const IllustrationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [illustration, setIllustration] = useState<Illustration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIllustration = async () => {
      if (!id) return;
      try {
        const data = await illustrationApi.getIllustration(id);
        setIllustration(data);
      } catch (error) {
        console.error('Error fetching illustration:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIllustration();
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPercent = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        gap={3}
      >
        <CircularProgress size={64} thickness={4} />
        <Typography variant="h6" color="text.secondary" fontWeight={500}>
          Loading illustration...
        </Typography>
      </Box>
    );
  }

  if (!illustration) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Illustration not found</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pb: 8 }}>
      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1B75BB 0%, #00ADEE 100%)',
          pt: 4,
          pb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ color: 'white', mb: 3 }}
          >
            Back
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Policy Illustration
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                {illustration.policyDetails.productName}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Chip
                  label={illustration.policyNumber}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={`Generated ${formatDate(illustration.generatedDate)}`}
                  icon={<CalendarToday sx={{ color: 'white !important' }} />}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                  }}
                />
              </Stack>
            </Box>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Download PDF">
                <IconButton
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                >
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                  onClick={() => window.print()}
                >
                  <Print />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Policy Details Cards */}
      <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Person sx={{ color: '#1B75BB', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700}>
                  Insured
                </Typography>
              </Box>
              <Stack spacing={1}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {illustration.policyDetails.insuredName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Age / Gender
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {illustration.policyDetails.age} / {illustration.policyDetails.gender}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Issue Date
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatDate(illustration.policyDetails.issueDate)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Security sx={{ color: '#37A526', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700}>
                  Coverage
                </Typography>
              </Box>
              <Stack spacing={1}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Death Benefit
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#37A526' }}>
                    {formatCurrency(illustration.policyDetails.faceAmount)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Premium ({illustration.policyDetails.premiumMode})
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatCurrency(illustration.policyDetails.modalPremium)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <AccountBalance sx={{ color: '#F6921E', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700}>
                  Current Values
                </Typography>
              </Box>
              <Stack spacing={1}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Policy Year
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {illustration.currentValues.policyYear}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cash Surrender Value
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#F6921E' }}>
                    {formatCurrency(illustration.currentValues.cashSurrenderValue)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Assumptions Alert */}
        <Alert
          severity="info"
          icon={<TrendingUp />}
          sx={{ mb: 3 }}
        >
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Illustration Assumptions
          </Typography>
          <Typography variant="body2">
            Guaranteed Rate: {formatPercent(illustration.assumptions.guaranteedInterestRate)} •
            Illustrated Rate: {formatPercent(illustration.assumptions.illustratedInterestRate)} •
            {illustration.assumptions.currentCostOfInsurance ? 'Current COI' : 'Projected COI'}
          </Typography>
        </Alert>

        {/* Projection Table */}
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 3, bgcolor: '#F8F9FA', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" fontWeight={700}>
              Value Projections
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Projected policy values over time based on current assumptions
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Year</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Premium</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Cash Value (Guaranteed)
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Cash Value (Illustrated)
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Death Benefit (Guaranteed)
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Death Benefit (Illustrated)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {illustration.projections.map((proj, index) => (
                  <TableRow
                    key={proj.year}
                    sx={{
                      '&:nth-of-type(odd)': { bgcolor: '#FAFAFA' },
                      ...(index === 0 && {
                        bgcolor: '#E8F5FF !important',
                        '& td': { fontWeight: 600 },
                      }),
                    }}
                  >
                    <TableCell>{proj.year}</TableCell>
                    <TableCell>{proj.age}</TableCell>
                    <TableCell align="right">{formatCurrency(proj.premium)}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(proj.cashSurrenderValue.guaranteed)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#1B75BB', fontWeight: 600 }}>
                      {formatCurrency(proj.cashSurrenderValue.illustrated)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(proj.deathBenefit.guaranteed)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#37A526', fontWeight: 600 }}>
                      {formatCurrency(proj.deathBenefit.illustrated)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Disclosures */}
        {illustration.disclosures && illustration.disclosures.length > 0 && (
          <Paper sx={{ p: 3, mt: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Info sx={{ color: '#808285' }} />
              <Typography variant="h6" fontWeight={700}>
                Important Disclosures
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              {illustration.disclosures.map((disclosure, index) => (
                <Typography key={index} variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                  • {disclosure}
                </Typography>
              ))}
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default IllustrationDetails;
