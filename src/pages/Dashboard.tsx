import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import type { Policy, CustomerAction } from '../types/policy';
import { policyApi, actionApi } from '../services/mockApi';
import PolicyCard from '../components/PolicyCard';
import ActionAlert from '../components/ActionAlert';
import './Dashboard.css';

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

  const lifePolicies = policies.filter(p => p.type === 'life');
  const annuityPolicies = policies.filter(p => p.type === 'annuity');
  const pcPolicies = policies.filter(p => p.type === 'property' || p.type === 'casualty');
  const pendingActions = actions.filter(a => a.status === 'pending' || a.status === 'in_review');

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner label="Loading your policies..." />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Insurance Portal</h1>
        <p className="dashboard-subtitle">Welcome back! Here's an overview of your policies and actions.</p>
      </div>

      {pendingActions.length > 0 && (
        <div className="actions-section">
          <h2>Actions Required</h2>
          <div className="actions-grid">
            {pendingActions.map(action => (
              <ActionAlert
                key={action.id}
                action={action}
                onClick={() => navigate('/actions')}
              />
            ))}
          </div>
        </div>
      )}

      <div className="policies-section">
        {lifePolicies.length > 0 && (
          <div className="policy-category">
            <h2>Life Insurance</h2>
            <div className="policies-grid">
              {lifePolicies.map(policy => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  onClick={() => navigate(`/policy/${policy.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {annuityPolicies.length > 0 && (
          <div className="policy-category">
            <h2>Annuities</h2>
            <div className="policies-grid">
              {annuityPolicies.map(policy => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  onClick={() => navigate(`/policy/${policy.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {pcPolicies.length > 0 && (
          <div className="policy-category">
            <h2>Property & Casualty</h2>
            <div className="policies-grid">
              {pcPolicies.map(policy => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  onClick={() => navigate(`/policy/${policy.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
