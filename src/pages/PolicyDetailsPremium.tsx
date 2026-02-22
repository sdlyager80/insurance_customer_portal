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
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Security,
  CalendarToday,
  AccountBalance,
  Favorite,
  RequestQuote,
  Visibility,
  TrendingUp,
  Payment,
  PictureAsPdf,
} from '@mui/icons-material';
import type { Policy, Illustration } from '../types/policy';
import { policyApi, illustrationApi } from '../services/mockApi';
import AnnuityLoanPayoutRequest from '../components/AnnuityLoanPayoutRequest';
import PolicyValueChart from '../components/PolicyValueChart';

const PolicyDetailsPremium = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoanPayoutDialogOpen, setIsLoanPayoutDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [policyData, illustrationsData] = await Promise.all([
          policyApi.getPolicyById(id),
          illustrationApi.getIllustrationsByPolicy(id),
        ]);
        if (policyData) {
          setPolicy(policyData);
        }
        setIllustrations(illustrationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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


  const handleIllustrationRequest = () => {
    // Redirect to external illustration UI
    const illustrationUrl = 'https://illustrations-ui.demo-1.hub-1.illus-dev.assure.dxc.com/index.html?type=UniversalLifeProducts&id=2a7254ac-93c8-45fa-b35e-a7ac079ceeac#/';
    window.open(illustrationUrl, '_blank');
  };

  const handleLoanPayoutRequest = (requestData: any) => {
    console.log('Loan/Payout Request Submitted:', requestData);
    // In real app, would submit to API
    alert('Your loan/payout request has been submitted successfully! You will receive a confirmation email shortly.');
  };

  // Generate sample policy value projection data
  const generatePolicyValueData = () => {
    const data = [];
    const initialValue = policy!.coverageAmount;
    const currentAge = 45; // Mock age, would come from policy data
    const annualPremium = policy!.premium * (policy!.paymentFrequency === 'monthly' ? 12 : 1);
    const years = 30;

    for (let year = 0; year <= years; year++) {
      const growthRate = policy!.type === 'annuity' ? 0.055 : 0.045; // 5.5% for annuity, 4.5% for life
      const accountValue = initialValue * Math.pow(1 + growthRate, year);
      const cashValue = accountValue * (0.80 + (year * 0.01)); // Increases over time
      const deathBenefit = policy!.type === 'life' ? initialValue + (accountValue * 0.3) : 0;
      const guaranteedValue = policy!.type === 'annuity' ? initialValue * Math.pow(1.03, year) : undefined;

      data.push({
        year,
        age: currentAge + year,
        accountValue: Math.round(accountValue),
        cashValue: Math.round(Math.min(cashValue, accountValue)),
        deathBenefit: Math.round(deathBenefit),
        premiumsPaid: Math.round(annualPremium * year),
        guaranteedValue: guaranteedValue ? Math.round(guaranteedValue) : undefined,
      });
    }

    return data;
  };

  const policyValueData = policy ? generatePolicyValueData() : [];

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
          Loading policy details...
        </Typography>
      </Box>
    );
  }

  if (!policy) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Policy not found</Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const isLifePolicy = policy.type === 'life';
  const policyColor = isLifePolicy ? '#D02E2E' : policy.type === 'annuity' ? '#8BC53F' : '#00ADEE';

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pb: 8 }}>
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: '#1B75BB',
          pt: 4,
          pb: { xs: 3, sm: 4, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ color: 'white', mb: 3 }}
          >
            Back to Dashboard
          </Button>

          {/* Title and Video Row */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: { xs: 2, md: 3 },
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            pb: { xs: 2, md: 0 }
          }}>
            {/* Left Side - Policy Info */}
            <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 0 }, mb: { xs: 2, md: 0 } }}>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 1,
                  fontFamily: 'inherit',
                }}
              >
                {policy.productName}
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                Policy Details
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Chip
                  label={policy.policyNumber}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    letterSpacing: 0.4,
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={policy.status.toUpperCase()}
                  icon={<Security sx={{ color: 'white !important' }} />}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                  }}
                />
              </Stack>

              {/* Product Document Link and Button */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                <Box
                  component="a"
                  href="/bloom-securelife-product-overview.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: 'white',
                    textDecoration: 'underline',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'rgba(255, 255, 255, 0.85)',
                    },
                  }}
                >
                  <PictureAsPdf sx={{ fontSize: 20 }} />
                  Product Document
                </Box>

                {isLifePolicy ? (
                  <Button
                    variant="contained"
                    startIcon={<RequestQuote fontSize="small" />}
                    onClick={handleIllustrationRequest}
                    sx={{
                      bgcolor: 'white',
                      color: '#1B75BB',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      py: 0.5,
                      px: 1.5,
                      minHeight: 32,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    Request Illustration
                  </Button>
                ) : policy.type === 'annuity' ? (
                  <Button
                    variant="contained"
                    startIcon={<Payment fontSize="small" />}
                    onClick={() => setIsLoanPayoutDialogOpen(true)}
                    sx={{
                      bgcolor: 'white',
                      color: '#1B75BB',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      py: 0.5,
                      px: 1.5,
                      minHeight: 32,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    Request Loan/Withdrawal
                  </Button>
                ) : null}
              </Box>
            </Box>

            {/* Right Side - Educational Video */}
            <Box
              sx={{
                width: { xs: '100%', sm: 400, md: 320, lg: 350 },
                maxWidth: { xs: '100%', sm: 400, md: 320, lg: 350 },
                aspectRatio: '16 / 9',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                mx: { xs: 'auto', md: 0 },
                flexShrink: 0,
                alignSelf: 'flex-start',
              }}
            >
              {/* SharePoint Video - Using HTML5 video element */}
              <video
                autoPlay
                muted
                loop
                playsInline
                controls
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              >
                <source
                  src="https://dxcportal.sharepoint.com/sites/SmartAppIdeation/Shared%20Documents/Videos/Fixed%20Annuity.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 3, sm: 2, md: -4 }, position: 'relative', zIndex: 2 }}>
        {/* Coverage Summary Card */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            mb: 4,
            background: 'white',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: `${policyColor}20`, width: 56, height: 56 }}>
                <Security sx={{ color: policyColor, fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Coverage Amount
                </Typography>
                <Typography variant="h4" fontWeight={700} color="#000000">
                  {formatCurrency(policy.coverageAmount)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#F6921E20', width: 56, height: 56 }}>
                <AccountBalance sx={{ color: '#F6921E', fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {policy.paymentFrequency.charAt(0).toUpperCase() + policy.paymentFrequency.slice(1)} Premium
                </Typography>
                <Typography variant="h4" fontWeight={700} color="#000000">
                  {formatCurrency(policy.premium)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#1B75BB20', width: 56, height: 56 }}>
                <CalendarToday sx={{ color: '#1B75BB', fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Next Payment
                </Typography>
                <Typography variant="h6" fontWeight={700} color="#000000">
                  {formatDate(policy.nextPaymentDate)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          {/* Policy Information */}
          <Box>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'inherit' }}>
                  Policy Information
                </Typography>
                <Tooltip title="Edit Policy">
                  <IconButton size="small">
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Stack spacing={2.5} divider={<Divider />}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Effective Date
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatDate(policy.effectiveDate)}
                  </Typography>
                </Box>
                {policy.expirationDate && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Expiration Date
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatDate(policy.expirationDate)}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Policy Type
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Payment Frequency
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {policy.paymentFrequency.charAt(0).toUpperCase() + policy.paymentFrequency.slice(1)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Insured Information */}
          <Box>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'inherit' }}>
                  Insured Information
                </Typography>
                <Tooltip title="Edit Contact">
                  <IconButton size="small">
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Stack spacing={2.5} divider={<Divider />}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Name
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {policy.insured.firstName} {policy.insured.lastName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Date of Birth
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatDate(policy.insured.dateOfBirth)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {policy.insured.email}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Phone
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {policy.insured.phone}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Address
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {policy.insured.address.street}<br />
                    {policy.insured.address.city}, {policy.insured.address.state} {policy.insured.address.zipCode}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Box>

        {/* Animated Policy Value Chart */}
        {(policy.type === 'life' || policy.type === 'annuity') && (
          <Box sx={{ mt: 3 }}>
            <PolicyValueChart
              policyType={policy.type}
              data={policyValueData}
              productName={policy.productName}
            />
          </Box>
        )}

        {/* Beneficiaries */}
        {policy.beneficiaries && policy.beneficiaries.length > 0 && (
          <Box sx={{ mt: 3 }}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Favorite sx={{ color: policyColor }} />
                    <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'inherit' }}>
                      Beneficiaries
                    </Typography>
                  </Box>
                  <Button startIcon={<Edit />} variant="outlined" size="small">
                    Manage
                  </Button>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  {policy.beneficiaries.map((beneficiary) => (
                    <Card key={beneficiary.id} variant="outlined" sx={{ borderColor: 'divider' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="h6" fontWeight={600}>
                              {beneficiary.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {beneficiary.relationship}
                            </Typography>
                            <Chip
                              label={beneficiary.isPrimary ? 'Primary' : 'Contingent'}
                              size="small"
                              sx={{ mt: 1, color: '#000000', fontWeight: 600, bgcolor: beneficiary.isPrimary ? '#1B75BB20' : '#80828520', border: '1px solid', borderColor: beneficiary.isPrimary ? '#1B75BB4D' : '#8082854D' }}
                            />
                          </Box>
                          <Typography variant="h4" fontWeight={700} color="#000000">
                            {beneficiary.percentage}%
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Box>
          )}

        {/* Coverages */}
        {policy.coverages && policy.coverages.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3, fontFamily: 'inherit' }}>
                Coverage Details
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                {policy.coverages.map((coverage) => (
                  <Box key={coverage.id}>
                      <Card variant="outlined" sx={{ borderColor: 'divider', height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {coverage.type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {coverage.description}
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Coverage Limit
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {formatCurrency(coverage.limit)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Deductible
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {formatCurrency(coverage.deductible)}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          )}

        {/* Illustrations Section (Life Insurance Only) */}
        {isLifePolicy && (
          <Box sx={{ mt: 3 }}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp sx={{ color: '#1B75BB' }} />
                    <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'inherit' }}>
                      Policy Illustrations
                    </Typography>
                  </Box>
                  <Button
                    startIcon={<RequestQuote />}
                    variant="contained"
                    onClick={handleIllustrationRequest}
                    sx={{
                      bgcolor: '#1B75BB',
                      '&:hover': {
                        bgcolor: '#155f99',
                      },
                    }}
                  >
                    Request New Illustration
                  </Button>
                </Box>
                {illustrations.length > 0 ? (
                  <List>
                    {illustrations.map((illustration) => (
                      <ListItem
                        key={illustration.id}
                        secondaryAction={
                          <Button
                            startIcon={<Visibility />}
                            variant="outlined"
                            onClick={() => navigate(`/illustration/${illustration.id}`)}
                          >
                            View
                          </Button>
                        }
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          mb: 1,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight={600}>
                              {illustration.illustrationType === 'inforce' ? 'In-Force Illustration' :
                               illustration.illustrationType === 'policy_change' ? 'Policy Change Illustration' :
                               'New Coverage Quote'}
                            </Typography>
                          }
                          secondary={`Generated on ${formatDate(illustration.generatedDate)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Alert severity="info">
                    No illustrations available. Request an illustration to see projected policy values and performance.
                  </Alert>
                )}
              </Paper>
            </Box>
          )}
      </Container>

      {/* Annuity Loan/Payout Request Dialog */}
      {policy.type === 'annuity' && (
        <AnnuityLoanPayoutRequest
          open={isLoanPayoutDialogOpen}
          onClose={() => setIsLoanPayoutDialogOpen(false)}
          annuityData={{
            policyNumber: policy.policyNumber,
            productName: policy.productName,
            currentValue: policy.coverageAmount, // Using coverageAmount as proxy for account value
            cashSurrenderValue: policy.coverageAmount * 0.95, // Assume 95% of account value
            loanBalance: 0, // No existing loan
            maxLoanAmount: policy.coverageAmount * 0.5, // Max 50% loan-to-value
            surrenderChargePercent: 7, // 7% surrender charge
            surrenderChargeYearsRemaining: 3, // 3 years remaining in surrender period
            annualGrowthRate: 5.5, // Assumed 5.5% annual growth
            age: 62, // Assumed age (would come from policy insured data in real app)
          }}
          onSubmit={handleLoanPayoutRequest}
        />
      )}
    </Box>
  );
};

export default PolicyDetailsPremium;
