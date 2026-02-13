import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Chip,
  Stack,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Card,
  CardContent,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Upload,
  Schedule,
  Person,
  Phone,
  Email,
  Description,
  CloudUpload,
  Pending,
  VerifiedUser,
  Error as ErrorIcon,
  Timeline,
  SmartToy,
  AccessTime,
} from '@mui/icons-material';

interface Document {
  id: string;
  name: string;
  required: boolean;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadedDate?: string;
  rejectionReason?: string;
}

interface ClaimActivity {
  timestamp: string;
  action: string;
  performer: string;
  note?: string;
}

interface ClaimTrackerProps {
  claimNumber: string;
  claimType: string;
  submittedDate: string;
  claimAmount: number;
  currentStatus: 'submitted' | 'under_review' | 'pending_documents' | 'approved' | 'paid' | 'denied';
  adjusterName?: string;
  adjusterPhone?: string;
  adjusterEmail?: string;
}

const ClaimTracker = ({
  claimNumber,
  claimType,
  submittedDate,
  claimAmount,
  currentStatus,
  adjusterName = 'Sarah Johnson',
  adjusterPhone = '(555) 123-4567',
  adjusterEmail = 's.johnson@bloominsurance.com',
}: ClaimTrackerProps) => {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Claim Form', required: true, status: 'verified', uploadedDate: '2026-02-10' },
    { id: '2', name: 'Police Report', required: true, status: 'verified', uploadedDate: '2026-02-10' },
    { id: '3', name: 'Repair Estimates', required: true, status: 'uploaded', uploadedDate: '2026-02-11' },
    { id: '4', name: 'Photos of Damage', required: true, status: 'pending' },
    { id: '5', name: 'Medical Records', required: false, status: 'pending' },
  ]);

  const [activities] = useState<ClaimActivity[]>([
    { timestamp: '2026-02-12 10:30 AM', action: 'Claim assigned to adjuster', performer: 'System', note: 'Assigned to Sarah Johnson' },
    { timestamp: '2026-02-11 3:45 PM', action: 'Document uploaded', performer: 'You', note: 'Repair Estimates uploaded' },
    { timestamp: '2026-02-11 9:15 AM', action: 'Documents verified', performer: 'Sarah Johnson', note: 'Claim Form and Police Report approved' },
    { timestamp: '2026-02-10 2:00 PM', action: 'Claim submitted', performer: 'You' },
  ]);

  // AI-powered processing percentage (simulated)
  const [processingPercentage, setProcessingPercentage] = useState(65);

  useEffect(() => {
    // Simulate AI processing progress
    const interval = setInterval(() => {
      setProcessingPercentage((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 2;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Calculate estimated completion time
  const calculateEstimatedCompletion = () => {
    const pendingDocs = documents.filter(d => d.required && d.status === 'pending').length;
    const baseHours = 48; // 2 days base
    const docPenalty = pendingDocs * 24; // 1 day per pending doc
    const totalHours = baseHours + docPenalty;

    const completionDate = new Date();
    completionDate.setHours(completionDate.getHours() + totalHours);

    return {
      hours: totalHours,
      date: completionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      days: Math.ceil(totalHours / 24),
    };
  };

  const estimated = calculateEstimatedCompletion();

  // Step configuration
  const steps = [
    {
      label: 'Claim Submitted',
      description: 'Your claim has been received',
      status: 'completed',
      date: submittedDate,
    },
    {
      label: 'Under Review',
      description: 'Adjuster is reviewing your claim',
      status: currentStatus === 'submitted' ? 'pending' : 'completed',
      date: currentStatus !== 'submitted' ? '2026-02-11' : undefined,
    },
    {
      label: 'Document Verification',
      description: 'Verifying submitted documents',
      status: currentStatus === 'pending_documents' ? 'active' : currentStatus === 'submitted' || currentStatus === 'under_review' ? 'pending' : 'completed',
      date: undefined,
    },
    {
      label: 'Approval',
      description: 'Final approval process',
      status: currentStatus === 'approved' ? 'completed' : 'pending',
      date: undefined,
    },
    {
      label: 'Payment Issued',
      description: 'Payment processed',
      status: currentStatus === 'paid' ? 'completed' : 'pending',
      date: undefined,
    },
  ];

  const activeStep = steps.findIndex(s => s.status === 'active' || s.status === 'pending');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle color="success" />;
      case 'uploaded':
        return <Schedule color="warning" />;
      case 'rejected':
        return <ErrorIcon color="error" />;
      default:
        return <Pending color="disabled" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'uploaded':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleFileUpload = (docId: string) => {
    // Simulate file upload
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === docId
          ? { ...doc, status: 'uploaded', uploadedDate: new Date().toISOString().split('T')[0] }
          : doc
      )
    );
  };

  return (
    <Box>
      {/* Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1B75BB 0%, #00ADEE 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Claim #{claimNumber}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {claimType}
            </Typography>
          </Box>
          <Chip
            label={currentStatus.replace('_', ' ').toUpperCase()}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Claim Amount
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {formatCurrency(claimAmount)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Submitted
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {new Date(submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Est. Completion
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {estimated.date}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              (~{estimated.days} days)
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        {/* Left Column */}
        <Stack spacing={3}>
          {/* AI Processing Status */}
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <SmartToy />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    AI-Powered Processing
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your claim is {processingPercentage.toFixed(0)}% processed
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={processingPercentage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mb: 1,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: processingPercentage < 50 ? '#F6921E' : processingPercentage < 80 ? '#00ADEE' : '#8BC53F',
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {processingPercentage < 50 && '🔍 Analyzing claim details and documents...'}
                {processingPercentage >= 50 && processingPercentage < 80 && '📋 Verifying coverage and policy terms...'}
                {processingPercentage >= 80 && '✅ Final review and approval in progress...'}
              </Typography>
            </CardContent>
          </Card>

          {/* Timeline Alert */}
          {estimated.days > 3 && (
            <Alert
              severity="warning"
              icon={<AccessTime />}
              action={
                <Button color="inherit" size="small">
                  Speed Up
                </Button>
              }
            >
              <Typography variant="body2" fontWeight={600}>
                Missing documents may delay processing
              </Typography>
              <Typography variant="caption">
                Upload all required documents to speed up your claim
              </Typography>
            </Alert>
          )}

          {/* Progress Stepper */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Claim Progress
            </Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={`${step.label}-${index}`} completed={step.status === 'completed'}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        '&.Mui-completed': {
                          color: '#8BC53F',
                        },
                        '&.Mui-active': {
                          color: '#1B75BB',
                        },
                      },
                    }}
                  >
                    <Typography variant="body1" fontWeight={600}>
                      {step.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {step.description}
                    </Typography>
                    {step.date && (
                      <Chip
                        label={step.date}
                        size="small"
                        sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </StepLabel>
                  {step.status === 'active' && (
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        Currently in progress
                      </Typography>
                    </StepContent>
                  )}
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Document Checklist */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Document Checklist
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {documents.filter(d => d.status === 'verified').length} of {documents.filter(d => d.required).length} required documents verified
            </Typography>

            <List>
              {documents.map((doc) => (
                <ListItem
                  key={doc.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: doc.status === 'verified' ? 'success.50' : doc.status === 'rejected' ? 'error.50' : 'background.paper',
                  }}
                >
                  <ListItemIcon>{getStatusIcon(doc.status)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {doc.name}
                        </Typography>
                        {doc.required && (
                          <Chip label="Required" size="small" color="error" variant="outlined" />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Chip
                          label={doc.status.toUpperCase()}
                          size="small"
                          color={getStatusColor(doc.status) as any}
                          sx={{ mr: 1 }}
                        />
                        {doc.uploadedDate && `Uploaded: ${doc.uploadedDate}`}
                        {doc.rejectionReason && (
                          <Typography variant="caption" color="error.main" display="block">
                            Reason: {doc.rejectionReason}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    {doc.status === 'pending' && (
                      <Tooltip title="Upload Document">
                        <IconButton
                          edge="end"
                          color="primary"
                          onClick={() => handleFileUpload(doc.id)}
                        >
                          <CloudUpload />
                        </IconButton>
                      </Tooltip>
                    )}
                    {doc.status === 'uploaded' && (
                      <Tooltip title="Awaiting verification">
                        <Schedule color="warning" />
                      </Tooltip>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Stack>

        {/* Right Column */}
        <Stack spacing={3}>
          {/* Adjuster Contact */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Your Adjuster
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                <Person sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {adjusterName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Senior Claims Adjuster
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" color="action" />
                <Typography variant="body2">{adjusterPhone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" color="action" />
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {adjusterEmail}
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Phone />}
              sx={{ mt: 2 }}
            >
              Call Adjuster
            </Button>
          </Paper>

          {/* Activity Timeline */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Timeline color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Activity Log
              </Typography>
            </Box>
            <Stack spacing={2}>
              {activities.map((activity, index) => (
                <Box key={activity.timestamp}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        width: 8,
                        bgcolor: index === 0 ? 'primary.main' : 'grey.300',
                        borderRadius: 4,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.performer} • {activity.timestamp}
                      </Typography>
                      {activity.note && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {activity.note}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Quick Actions */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                fullWidth
              >
                Upload Documents
              </Button>
              <Button
                variant="outlined"
                startIcon={<Description />}
                fullWidth
              >
                View Claim Details
              </Button>
              <Button
                variant="outlined"
                startIcon={<VerifiedUser />}
                fullWidth
              >
                Check Coverage
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default ClaimTracker;
