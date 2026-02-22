import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chip } from '@mui/material';
import Spinner from '../components/Spinner';
import type { Policy, Beneficiary } from '../types/policy';
import { policyApi } from '../services/mockApi';
import './PolicyDetails.css';

const PolicyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPolicy = async () => {
      if (id) {
        try {
          const data = await policyApi.getPolicyById(id);
          if (data) {
            setPolicy(data);
          }
        } catch (error) {
          console.error('Error fetching policy:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPolicy();
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusChipSx = (status: string) => {
    switch (status) {
      case 'active':
        return { bgcolor: '#37A52620', borderColor: '#37A5264D' };
      case 'pending':
        return { bgcolor: '#E8DE2320', borderColor: '#E8DE234D' };
      case 'lapsed':
        return { bgcolor: '#F6921E20', borderColor: '#F6921E4D' };
      case 'cancelled':
        return { bgcolor: '#D02E2E20', borderColor: '#D02E2E4D' };
      default:
        return { bgcolor: '#80828520', borderColor: '#8082854D' };
    }
  };

  const handleEdit = (field: string, currentValue: string) => {
    setEditMode(field);
    setEditValues({ [field]: currentValue });
  };

  const handleSave = async (field: string) => {
    if (policy && id) {
      try {
        const updates = { [field]: editValues[field] };
        await policyApi.updatePolicy(id, updates);
        setPolicy({ ...policy, ...updates as Partial<Policy> });
        setEditMode(null);
      } catch (error) {
        console.error('Error updating policy:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditMode(null);
    setEditValues({});
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner label="Loading policy details..." />
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="error-container">
        <h2>Policy Not Found</h2>
        <button className="primary-button" onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="policy-details-container">
      <div className="policy-details-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>

      <div className="policy-hero">
        <div className="policy-hero-title">
          <h1>{policy.productName}</h1>
          <Chip
            label={policy.status.toUpperCase()}
            size="small"
            sx={{ ...getStatusChipSx(policy.status), color: '#000000', fontWeight: 600, border: '1px solid' }}
          />
        </div>
        <p className="policy-hero-number">{policy.policyNumber}</p>
      </div>

      <div className="policy-inset">
        <div className="policy-sections">
          <section className="policy-section">
            <h2>Coverage Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Coverage Amount</span>
                <span className="detail-value">{formatCurrency(policy.coverageAmount)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Effective Date</span>
                <span className="detail-value">{formatDate(policy.effectiveDate)}</span>
              </div>
              {policy.expirationDate && (
                <div className="detail-item">
                  <span className="detail-label">Expiration Date</span>
                  <span className="detail-value">{formatDate(policy.expirationDate)}</span>
                </div>
              )}
            </div>
          </section>

          <section className="policy-section">
            <h2>Payment Information</h2>
            <div className="detail-grid">
              <div className="detail-item editable-item">
                <span className="detail-label">Premium</span>
                {editMode === 'premium' ? (
                  <div className="edit-controls">
                    <input
                      type="number"
                      className="edit-input"
                      value={editValues.premium || ''}
                      onChange={(e) => setEditValues({ ...editValues, premium: e.target.value })}
                    />
                    <button className="save-button" onClick={() => handleSave('premium')}>Save</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <span className="detail-value">{formatCurrency(policy.premium)}</span>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit('premium', policy.premium.toString())}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
              <div className="detail-item editable-item">
                <span className="detail-label">Payment Frequency</span>
                {editMode === 'paymentFrequency' ? (
                  <div className="edit-controls">
                    <select
                      className="edit-select"
                      value={editValues.paymentFrequency || policy.paymentFrequency}
                      onChange={(e) => setEditValues({ ...editValues, paymentFrequency: e.target.value })}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="semi-annual">Semi-Annual</option>
                      <option value="annual">Annual</option>
                    </select>
                    <button className="save-button" onClick={() => handleSave('paymentFrequency')}>Save</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <span className="detail-value">{policy.paymentFrequency}</span>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit('paymentFrequency', policy.paymentFrequency)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label">Next Payment Date</span>
                <span className="detail-value">{formatDate(policy.nextPaymentDate)}</span>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>Insured Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Name</span>
                <span className="detail-value">
                  {policy.insured.firstName} {policy.insured.lastName}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date of Birth</span>
                <span className="detail-value">{formatDate(policy.insured.dateOfBirth)}</span>
              </div>
              <div className="detail-item editable-item">
                <span className="detail-label">Email</span>
                {editMode === 'insured.email' ? (
                  <div className="edit-controls">
                    <input
                      type="email"
                      className="edit-input"
                      value={editValues['insured.email'] || ''}
                      onChange={(e) => setEditValues({ ...editValues, 'insured.email': e.target.value })}
                    />
                    <button className="save-button" onClick={() => handleSave('insured.email')}>Save</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <span className="detail-value">{policy.insured.email}</span>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit('insured.email', policy.insured.email)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
              <div className="detail-item editable-item">
                <span className="detail-label">Phone</span>
                {editMode === 'insured.phone' ? (
                  <div className="edit-controls">
                    <input
                      type="tel"
                      className="edit-input"
                      value={editValues['insured.phone'] || ''}
                      onChange={(e) => setEditValues({ ...editValues, 'insured.phone': e.target.value })}
                    />
                    <button className="save-button" onClick={() => handleSave('insured.phone')}>Save</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <span className="detail-value">{policy.insured.phone}</span>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit('insured.phone', policy.insured.phone)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Address</span>
                <span className="detail-value">
                  {policy.insured.address.street}, {policy.insured.address.city},{' '}
                  {policy.insured.address.state} {policy.insured.address.zipCode}
                </span>
              </div>
            </div>
          </section>

          {policy.beneficiaries && policy.beneficiaries.length > 0 && (
            <section className="policy-section">
              <h2>Beneficiaries</h2>
              <div className="beneficiaries-list">
                {policy.beneficiaries.map((beneficiary: Beneficiary) => (
                  <div key={beneficiary.id} className="beneficiary-card">
                    <div className="beneficiary-info">
                      <h4>{beneficiary.name}</h4>
                      <p className="beneficiary-relationship">{beneficiary.relationship}</p>
                    </div>
                    <div className="beneficiary-percentage">
                      <span className="percentage-value">{beneficiary.percentage}%</span>
                      <span className="percentage-label">
                        {beneficiary.isPrimary ? 'Primary' : 'Contingent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {policy.coverages && policy.coverages.length > 0 && (
            <section className="policy-section">
              <h2>Coverages</h2>
              <div className="coverages-list">
                {policy.coverages.map((coverage) => (
                  <div key={coverage.id} className="coverage-card">
                    <h4>{coverage.type}</h4>
                    <p className="coverage-description">{coverage.description}</p>
                    <div className="coverage-details">
                      <div className="coverage-detail">
                        <span className="coverage-label">Limit</span>
                        <span className="coverage-value">{formatCurrency(coverage.limit)}</span>
                      </div>
                      <div className="coverage-detail">
                        <span className="coverage-label">Deductible</span>
                        <span className="coverage-value">{formatCurrency(coverage.deductible)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyDetails;
