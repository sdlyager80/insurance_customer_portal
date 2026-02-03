import Badge from './Badge';
import type { Policy } from '../types/policy';
import './PolicyCard.css';

interface PolicyCardProps {
  policy: Policy;
  onClick: () => void;
}

const PolicyCard = ({ policy, onClick }: PolicyCardProps) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'lapsed':
        return 'orange';
      case 'cancelled':
        return 'red';
      default:
        return 'grey';
    }
  };

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case 'life':
        return '❤️';
      case 'annuity':
        return '💰';
      case 'property':
        return '🏠';
      case 'casualty':
        return '🚗';
      default:
        return '📋';
    }
  };

  return (
    <div className="policy-card" onClick={onClick}>
      <div className="policy-card-content">
        <div className="policy-header">
          <div className="policy-icon">{getPolicyIcon(policy.type)}</div>
          <div className="policy-title-section">
            <h3 className="policy-product-name">{policy.productName}</h3>
            <p className="policy-number">{policy.policyNumber}</p>
          </div>
          <Badge
            label={policy.status.toUpperCase()}
            color={getStatusColor(policy.status) as any}
          />
        </div>

        <div className="policy-details">
          <div className="policy-detail-row">
            <span className="detail-label">Coverage Amount</span>
            <span className="detail-value">{formatCurrency(policy.coverageAmount)}</span>
          </div>
          <div className="policy-detail-row">
            <span className="detail-label">Premium</span>
            <span className="detail-value">
              {formatCurrency(policy.premium)} / {policy.paymentFrequency}
            </span>
          </div>
          <div className="policy-detail-row">
            <span className="detail-label">Next Payment</span>
            <span className="detail-value">{formatDate(policy.nextPaymentDate)}</span>
          </div>
          <div className="policy-detail-row">
            <span className="detail-label">Effective Date</span>
            <span className="detail-value">{formatDate(policy.effectiveDate)}</span>
          </div>
        </div>

        <div className="policy-card-footer">
          <button
            className="policy-view-button"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyCard;
