import { Chip } from '@mui/material';
import type { CustomerAction } from '../types/policy';
import './ActionAlert.css';

interface ActionAlertProps {
  action: CustomerAction;
  onClick: () => void;
}

const ActionAlert = ({ action, onClick }: ActionAlertProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityType = (priority: string): 'info' | 'warning' | 'error' | 'success' => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  };

  const getStatusChipSx = (status: string) => {
    switch (status) {
      case 'pending':
        return { bgcolor: '#E8DE2320', borderColor: '#E8DE234D' };
      case 'in_review':
        return { bgcolor: '#1B75BB20', borderColor: '#1B75BB4D' };
      case 'approved':
      case 'completed':
        return { bgcolor: '#37A52620', borderColor: '#37A5264D' };
      case 'rejected':
        return { bgcolor: '#D02E2E20', borderColor: '#D02E2E4D' };
      default:
        return { bgcolor: '#80828520', borderColor: '#8082854D' };
    }
  };

  const alertClass = `action-alert-container alert-${getPriorityType(action.priority)}`;

  return (
    <div className={alertClass} onClick={onClick}>
      <div className="action-alert-content">
        <div className="action-alert-header">
          <div className="action-title-section">
            <h4 className="action-title">{action.title}</h4>
            <p className="action-policy">{action.policyNumber}</p>
          </div>
          <Chip
            label={action.status.replace('_', ' ').toUpperCase()}
            size="small"
            sx={{ ...getStatusChipSx(action.status), color: '#000000', fontWeight: 600, border: '1px solid' }}
          />
        </div>
        <p className="action-description">{action.description}</p>
        {action.dueDate && (
          <p className="action-due-date">
            Due: {formatDate(action.dueDate)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActionAlert;
