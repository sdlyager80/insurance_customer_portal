import Badge from './Badge';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'in_review':
        return 'blue';
      case 'approved':
        return 'green';
      case 'completed':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'grey';
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
          <Badge
            label={action.status.replace('_', ' ').toUpperCase()}
            color={getStatusColor(action.status) as any}
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
