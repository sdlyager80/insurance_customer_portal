import { useNavigate } from 'react-router-dom';
import { Box, Container, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import CoverageCalculator from '../components/CoverageCalculator';

const CoverageCalculatorPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3, color: '#1B75BB', fontWeight: 600 }}
        >
          Back to Dashboard
        </Button>

        <CoverageCalculator
          currentCoverage={0}
          onRecommendationAccept={(amount) => {
            alert(`Great! We'll help you get a quote for $${amount.toLocaleString()} in coverage.`);
            // In real app, would navigate to quote request page
          }}
        />
      </Container>
    </Box>
  );
};

export default CoverageCalculatorPage;
