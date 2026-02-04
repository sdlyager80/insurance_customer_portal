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
} from '@mui/icons-material';
import type { Policy, Illustration } from '../types/policy';
import { policyApi, illustrationApi } from '../services/mockApi';
import IllustrationRequestDialog from '../components/IllustrationRequestDialog';

const PolicyDetailsPremium = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [loading, setLoading] = useState(true);
  const [illustrationDialogOpen, setIllustrationDialogOpen] = useState(false);

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


  const handleIllustrationRequestExternal = () => {
    // Redirect to external illustration UI
    const illustrationUrl = 'https://illustrations-ui.dev-1.hub-1.illus-dev.assure.dxc.com/index.html?type=UniversalLifeProducts&id=31fb4f17-ad3d-4f8f-9caa-e6e4f32322b1#/';
    window.open(illustrationUrl, '_blank');
  };

  const handleIllustrationRequestDialog = () => {
    setIllustrationDialogOpen(true);
  };

  const handleIllustrationSubmit = async (requestData: any) => {
    if (!policy) return;

    try {
      await illustrationApi.createIllustrationRequest({
        policyId: policy.id,
        policyNumber: policy.policyNumber,
        requestedBy: `${policy.insured.firstName} ${policy.insured.lastName}`,
        requestType: requestData.requestType,
        scenarioType: requestData.scenarioType,
        projectionYears: requestData.projectionYears,
        additionalPremium: requestData.additionalPremium,
        notes: requestData.notes,
      });

      alert('Illustration request submitted successfully! You will be notified when it\'s ready.');
    } catch (error) {
      console.error('Error submitting illustration request:', error);
      alert('Failed to submit illustration request. Please try again.');
    }
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
          background: 'linear-gradient(135deg, #1B75BB 0%, #00ADEE 100%)',
          pt: 4,
          pb: 8,
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 1,
                  fontFamily: '"Roboto Slab", serif',
                }}
              >
                {policy.productName}
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                Policy Details
              </Typography>
              <Stack direction="row" spacing={2}>
                <Chip
                  label={policy.policyNumber}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontFamily: 'monospace',
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
            </Box>

            {isLifePolicy && (
              <Button
                variant="contained"
                size="large"
                startIcon={<RequestQuote />}
                onClick={handleIllustrationRequestExternal}
                sx={{
                  bgcolor: 'white',
                  color: policyColor,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Request Illustration
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 2 }}>
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
                <Typography variant="h4" fontWeight={700} sx={{ color: policyColor }}>
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
                <Typography variant="h4" fontWeight={700} sx={{ color: '#F6921E' }}>
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
                <Typography variant="h6" fontWeight={700} sx={{ color: '#1B75BB' }}>
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
                <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Roboto Slab", serif' }}>
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
                <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Roboto Slab", serif' }}>
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

        {/* Beneficiaries */}
        {policy.beneficiaries && policy.beneficiaries.length > 0 && (
          <Box sx={{ mt: 3 }}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Favorite sx={{ color: policyColor }} />
                    <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Roboto Slab", serif' }}>
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
                              color={beneficiary.isPrimary ? 'primary' : 'default'}
                              sx={{ mt: 1 }}
                            />
                          </Box>
                          <Typography variant="h4" fontWeight={700} sx={{ color: policyColor }}>
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
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3, fontFamily: '"Roboto Slab", serif' }}>
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
                    <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Roboto Slab", serif' }}>
                      Policy Illustrations
                    </Typography>
                  </Box>
                  <Button
                    startIcon={<RequestQuote />}
                    variant="contained"
                    onClick={handleIllustrationRequestDialog}
                    sx={{
                      bgcolor: '#1B75BB',
                      '&:hover': {
                        bgcolor: '#00ADEE',
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

      {/* Illustration Request Dialog */}
      {policy && (
        <IllustrationRequestDialog
          open={illustrationDialogOpen}
          onClose={() => setIllustrationDialogOpen(false)}
          policy={policy}
          onSubmit={handleIllustrationSubmit}
        />
      )}
    </Box>
  );
};

export default PolicyDetailsPremium;
