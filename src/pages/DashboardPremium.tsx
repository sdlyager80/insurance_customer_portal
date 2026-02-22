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
  Fade,
  Grow,
  Paper,
  Divider,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  Home,
  DirectionsCar,
  Favorite,
  CheckCircle,
  Schedule,
  ArrowForward,
  Notifications,
  Security,
} from '@mui/icons-material';
import type { Policy, CustomerAction } from '../types/policy';
import { policyApi, actionApi } from '../services/mockApi';
// import ClaimTracker from '../components/ClaimTracker'; // Uncomment when needed

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
        return <Favorite sx={{ fontSize: 32 }} />;
      case 'annuity':
        return <TrendingUp sx={{ fontSize: 32 }} />;
      case 'property':
        return <Home sx={{ fontSize: 32 }} />;
      case 'casualty':
        return <DirectionsCar sx={{ fontSize: 32 }} />;
      default:
        return <AccountBalance sx={{ fontSize: 32 }} />;
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
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const pendingActions = actions.filter(a => a.status === 'pending' || a.status === 'in_review');

  const totalCoverage = policies.reduce((sum, p) => sum + p.coverageAmount, 0);
  const totalPremium = policies.reduce((sum, p) => sum + p.premium, 0);

  // Personalized greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = policies[0]?.insured.firstName ?? 'there';
  const greeting = `${getTimeBasedGreeting()}, ${userName}!`;

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
          Loading your policies...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#1B75BB',
          position: 'relative',
          overflow: 'hidden',
          pt: 6,
          pb: 12,
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: 'inherit',
                }}
              >
                {greeting} 👋
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 400,
                  mb: 5,
                }}
              >
                Here's an overview of your insurance coverage
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Stats Cards - Overlapping Hero */}
      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 2 }}>
        <Grow in timeout={600}>
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
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#E8F5FF', width: 48, height: 48 }}>
                    <Security sx={{ color: '#1B75BB', fontSize: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      Total Coverage
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="#000000">
                      {formatCurrency(totalCoverage)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#E8F9F3', width: 48, height: 48 }}>
                    <CheckCircle sx={{ color: '#37A526', fontSize: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      Active Policies
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="#000000">
                      {policies.length}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#FFF4E6', width: 48, height: 48 }}>
                    <TrendingUp sx={{ color: '#F6921E', fontSize: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      Monthly Premium
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="#000000">
                      {formatCurrency(totalPremium)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grow>

        {/* To-Do Items */}
        {pendingActions.length > 0 && (
          <Box mb={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notifications sx={{ color: '#1B75BB' }} />
                <Typography variant="h5" fontWeight={700} sx={{ fontFamily: 'inherit' }}>
                  To-Do Items
                </Typography>
                <Chip label={pendingActions.length} size="small" sx={{ color: '#000000', fontWeight: 600, bgcolor: '#D02E2E20', border: '1px solid #D02E2E4D' }} />
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
              {pendingActions.map((action, index) => (
                <Grow in timeout={600 + index * 100} key={action.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderLeft: '4px solid',
                      borderLeftColor: action.priority === 'high' ? '#D02E2E' : action.priority === 'medium' ? '#E8DE23' : '#00ADEE',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => navigate('/actions')}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
                          {action.title}
                        </Typography>
                        <Chip
                          label={action.priority.toUpperCase()}
                          size="small"
                          sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#000000', border: '1px solid', ...getPriorityChipSx(action.priority) }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {action.description}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Chip
                          label={action.policyNumber}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: 0.3,
                            color: '#000000',
                            bgcolor: '#1B75BB20',
                            border: '1px solid',
                            borderColor: '#1B75BB4D',
                          }}
                        />
                        {action.dueDate && (
                          <Chip
                            icon={<Schedule sx={{ fontSize: 14, color: '#000000 !important' }} />}
                            label={`Due ${formatDate(action.dueDate)}`}
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#000000',
                              bgcolor: '#F6921E20',
                              border: '1px solid',
                              borderColor: '#F6921E4D',
                            }}
                          />
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grow>
              ))}
            </Box>
          </Box>
        )}

        {/* All Policies Section */}
        <Box mb={5}>
          <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3, fontFamily: 'inherit' }}>
            Your Policies
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
            {policies.map((policy, index) => {
              const iconBgColor = '#E8F5FF';
              const iconColor = '#1B75BB';

              return (
                <Grow in timeout={700 + index * 80} key={policy.id}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                        borderColor: iconColor,
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => navigate(`/policy/${policy.id}`)}
                      sx={{ height: '100%' }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                          <Avatar
                            sx={{
                              bgcolor: iconBgColor,
                              width: 56,
                              height: 56,
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            }}
                          >
                            <Box sx={{ color: iconColor }}>
                              {getPolicyIcon(policy.type)}
                            </Box>
                          </Avatar>
                          <Chip
                            label={policy.status.toUpperCase()}
                            size="small"
                            icon={<CheckCircle sx={{ fontSize: 16, color: '#000000 !important' }} />}
                            sx={{ fontWeight: 600, color: '#000000', border: '1px solid', ...getStatusChipSx(policy.status) }}
                          />
                        </Box>

                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
                          {policy.productName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            letterSpacing: 0.5,
                            display: 'block',
                            mb: 3,
                          }}
                        >
                          {policy.policyNumber}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                              Coverage Amount
                            </Typography>
                            <Typography variant="h6" fontWeight={700} color="#000000">
                              {formatCurrency(policy.coverageAmount)}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                Premium
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(policy.premium)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                Next Payment
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatDate(policy.nextPaymentDate)}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', color: '#1B75BB' }}>
                            <Typography variant="body2" fontWeight={600} sx={{ mr: 0.5 }}>
                              View Details
                            </Typography>
                            <ArrowForward sx={{ fontSize: 18 }} />
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grow>
              );
            })}
          </Box>
        </Box>

        {/* Mock Claim Tracker (if you have an active claim) */}
        {/* Uncomment to see the claim tracker */}
        {/*
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Active Claim
          </Typography>
          <ClaimTracker
            claimNumber="CLM-2026-00542"
            claimType="Auto Accident - Property Damage"
            submittedDate="2026-02-10"
            claimAmount={8500}
            currentStatus="pending_documents"
          />
        </Box>
        */}
      </Container>
    </Box>
  );
};

export default Dashboard;
