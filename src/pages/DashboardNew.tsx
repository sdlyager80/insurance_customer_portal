import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  CircularProgress,
  Stack,
  Avatar,
  Alert,
  AlertTitle,
  Fade,
  Grow,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  Home,
  DirectionsCar,
  Favorite,
  Warning,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import type { Policy, CustomerAction } from '../types/policy';
import { policyApi, actionApi } from '../services/mockApi';

const getPriorityColor = (priority: string): 'error' | 'warning' | 'info' => {
  if (priority === 'high') return 'error';
  if (priority === 'medium') return 'warning';
  return 'info';
};

const Dashboard = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [actions, setActions] = useState<CustomerAction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [policiesData, actionsData] = await Promise.all([
          policyApi.getAllPolicies(),
          actionApi.getAllActions()
        ]);
        setPolicies(policiesData);
        setActions(actionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case 'life':
        return <Favorite sx={{ fontSize: 40 }} />;
      case 'annuity':
        return <TrendingUp sx={{ fontSize: 40 }} />;
      case 'property':
        return <Home sx={{ fontSize: 40 }} />;
      case 'casualty':
        return <DirectionsCar sx={{ fontSize: 40 }} />;
      default:
        return <AccountBalance sx={{ fontSize: 40 }} />;
    }
  };

  const getStatusChipSx = (status: string) => {
    switch (status) {
      case 'active': return { bgcolor: '#37A52620', borderColor: '#37A5264D' };
      case 'pending': return { bgcolor: '#F6921E20', borderColor: '#F6921E4D' };
      case 'lapsed':
      case 'cancelled': return { bgcolor: '#D02E2E20', borderColor: '#D02E2E4D' };
      default: return { bgcolor: '#80828520', borderColor: '#8082854D' };
    }
  };

  const getPriorityChipSx = (priority: string) => {
    switch (priority) {
      case 'high': return { bgcolor: '#D02E2E20', borderColor: '#D02E2E4D' };
      case 'medium': return { bgcolor: '#F6921E20', borderColor: '#F6921E4D' };
      default: return { bgcolor: '#1B75BB20', borderColor: '#1B75BB4D' };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const lifePolicies = policies.filter(p => p.type === 'life');
  const annuityPolicies = policies.filter(p => p.type === 'annuity');
  const pcPolicies = policies.filter(p => p.type === 'property' || p.type === 'casualty');
  const pendingActions = actions.filter(a => a.status === 'pending' || a.status === 'in_review');

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading your policies...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#1B75BB',
          color: 'white',
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3 },
          mb: { xs: 3, sm: 4, md: 6 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box position="relative" zIndex={1}>
              <Typography variant="h2" gutterBottom fontWeight={700}>
                Welcome Back!
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.95, mb: 3 }}>
                Your Insurance Dashboard
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 3 }}
                sx={{
                  mt: { xs: 3, md: 4 },
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {policies.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Policies
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {pendingActions.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Pending Items
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {formatCurrency(policies.reduce((sum, p) => sum + p.premium, 0))}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Monthly Premium
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Pending Actions */}
        {pendingActions.length > 0 && (
          <Box mb={6}>
            <Typography variant="h4" gutterBottom fontWeight={600} mb={3}>
              To-Do Items
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 1fr',
              },
              gap: { xs: 1.5, sm: 2 }
            }}>
              {pendingActions.map((action, index) => (
                <Box key={action.id}>
                  <Grow in timeout={500 + index * 100}>
                    <Alert
                      severity={getPriorityColor(action.priority)}
                      icon={<Warning />}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => navigate('/actions')}
                    >
                      <AlertTitle sx={{ fontWeight: 600 }}>
                        {action.title}
                      </AlertTitle>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {action.description}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={action.policyNumber}
                          size="small"
                          variant="outlined"
                        />
                        {action.dueDate && (
                          <Chip
                            icon={<Schedule sx={{ color: '#000000 !important' }} />}
                            label={`Due ${formatDate(action.dueDate)}`}
                            size="small"
                            sx={{ color: '#000000', fontWeight: 600, border: '1px solid', ...getPriorityChipSx(action.priority) }}
                          />
                        )}
                      </Stack>
                    </Alert>
                  </Grow>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Life Insurance */}
        {lifePolicies.length > 0 && (
          <Box mb={6}>
            <Typography variant="h4" gutterBottom fontWeight={600} mb={3}>
              Life Insurance
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(auto-fit, minmax(280px, 1fr))',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: { xs: 2, sm: 2.5, md: 3 }
            }}>
              {lifePolicies.map((policy, index) => (
                <Box key={policy.id}>
                  <Grow in timeout={600 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 8,
                        },
                      }}
                    >
                      <CardActionArea onClick={() => navigate(`/policy/${policy.id}`)}>
                        <CardContent>
                          <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                            <Avatar
                              sx={{
                                bgcolor: '#D02E2E',
                                width: 56,
                                height: 56,
                              }}
                            >
                              {getPolicyIcon(policy.type)}
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="h6" fontWeight={600} gutterBottom>
                                {policy.productName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ letterSpacing: 0.4, fontWeight: 500 }}
                              >
                                {policy.policyNumber}
                              </Typography>
                            </Box>
                            <Chip
                              label={policy.status.toUpperCase()}
                              size="small"
                              icon={<CheckCircle sx={{ color: '#000000 !important' }} />}
                              sx={{ color: '#000000', fontWeight: 600, border: '1px solid', ...getStatusChipSx(policy.status) }}
                            />
                          </Stack>

                          <Stack spacing={1.5} mt={3}>
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2" color="text.secondary">
                                Coverage
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(policy.coverageAmount)}
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2" color="text.secondary">
                                Premium
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(policy.premium)}/{policy.paymentFrequency}
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2" color="text.secondary">
                                Next Payment
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatDate(policy.nextPaymentDate)}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grow>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Annuities */}
        {annuityPolicies.length > 0 && (
          <Box mb={6}>
            <Typography variant="h4" gutterBottom fontWeight={600} mb={3}>
              Annuities
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(auto-fit, minmax(280px, 1fr))',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: { xs: 2, sm: 2.5, md: 3 }
            }}>
              {annuityPolicies.map((policy, index) => (
                <Box key={policy.id}>
                  <Grow in timeout={600 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 8,
                        },
                      }}
                    >
                      <CardActionArea onClick={() => navigate(`/policy/${policy.id}`)}>
                        <CardContent>
                          <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                            <Avatar
                              sx={{
                                bgcolor: '#8BC53F',
                                width: 56,
                                height: 56,
                              }}
                            >
                              {getPolicyIcon(policy.type)}
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="h6" fontWeight={600} gutterBottom>
                                {policy.productName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ letterSpacing: 0.4, fontWeight: 500 }}
                              >
                                {policy.policyNumber}
                              </Typography>
                            </Box>
                            <Chip
                              label={policy.status.toUpperCase()}
                              size="small"
                              icon={<CheckCircle sx={{ color: '#000000 !important' }} />}
                              sx={{ color: '#000000', fontWeight: 600, border: '1px solid', ...getStatusChipSx(policy.status) }}
                            />
                          </Stack>

                          <Stack spacing={1.5} mt={3}>
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2" color="text.secondary">
                                Value
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(policy.coverageAmount)}
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2" color="text.secondary">
                                Payment
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(policy.premium)}/{policy.paymentFrequency}
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2" color="text.secondary">
                                Next Payment
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatDate(policy.nextPaymentDate)}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grow>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Property & Casualty */}
        {pcPolicies.length > 0 && (
          <Box mb={6}>
            <Typography variant="h4" gutterBottom fontWeight={600} mb={3}>
              Property & Casualty
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(auto-fit, minmax(280px, 1fr))',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: { xs: 2, sm: 2.5, md: 3 }
            }}>
              {pcPolicies.map((policy, index) => (
                <Box key={policy.id}>
                  <Grow in timeout={600 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 8,
                        },
                      }}
                    >
                      <CardActionArea onClick={() => navigate(`/policy/${policy.id}`)}>
                        <CardContent>
                          <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                            <Avatar
                              sx={{
                                bgcolor: '#00ADEE',
                                width: 56,
                                height: 56,
                              }}
                            >
                              {getPolicyIcon(policy.type)}
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="h6" fontWeight={600} gutterBottom>
                                {policy.productName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ letterSpacing: 0.4, fontWeight: 500 }}
                              >
                                {policy.policyNumber}
                              </Typography>
                            </Box>
                            <Chip
                              label={policy.status.toUpperCase()}
                              size="small"
                              icon={<CheckCircle sx={{ color: '#000000 !important' }} />}
                              sx={{ color: '#000000', fontWeight: 600, border: '1px solid', ...getStatusChipSx(policy.status) }}
                            />
                          </Stack>

                          <Stack spacing={1.5} mt={3}>
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2" color="text.secondary">
                                Coverage
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(policy.coverageAmount)}
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2" color="text.secondary">
                                Premium
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(policy.premium)}/{policy.paymentFrequency}
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2" color="text.secondary">
                                Next Payment
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatDate(policy.nextPaymentDate)}
                              </Typography>
                            </Box>
                            {policy.expirationDate && (
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  Expires
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {formatDate(policy.expirationDate)}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grow>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
