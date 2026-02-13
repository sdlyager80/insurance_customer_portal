import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';
import type { CustomerAction } from '../types/policy';
import { actionApi } from '../services/mockApi';
import './Actions.css';

const Actions = () => {
  const [actions, setActions] = useState<CustomerAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const data = await actionApi.getAllActions();
        setActions(data);
      } catch (error) {
        console.error('Error fetching actions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'blue';
      default:
        return 'grey';
    }
  };

  const handleCompleteAction = async (actionId: string) => {
    try {
      const updatedAction = await actionApi.updateActionStatus(
        actionId,
        'completed',
        'Action completed by customer'
      );
      setActions(actions.map(a => a.id === actionId ? updatedAction : a));
    } catch (error) {
      console.error('Error completing action:', error);
    }
  };

  const pendingActions = actions.filter(
    a => a.status === 'pending' || a.status === 'in_review'
  );
  const completedActions = actions.filter(
    a => a.status === 'completed' || a.status === 'approved' || a.status === 'rejected'
  );

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner label="Loading actions..." />
      </div>
    );
  }

  return (
    <div className="actions-container">
      <div className="actions-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
      </div>

      <h1>To-Do & Requests</h1>
      <p className="actions-subtitle">
        Track your policy to-do items, requests, and their progress through our system.
      </p>

      {pendingActions.length > 0 && (
        <section className="actions-section">
          <h2>Pending Items ({pendingActions.length})</h2>
          <div className="actions-inset">
            <div className="actions-list">
              {pendingActions.map(action => (
                <div key={action.id} className="action-item">
                  <div className="action-header">
                    <div className="action-title-area">
                      <h3>{action.title}</h3>
                      <p className="action-policy-link" onClick={() => navigate(`/policy/${action.policyId}`)}>
                        {action.policyNumber}
                      </p>
                    </div>
                    <div className="action-badges">
                      <Badge
                        label={action.priority.toUpperCase()}
                        color={getPriorityColor(action.priority) as any}
                      />
                      <Badge
                        label={action.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(action.status) as any}
                      />
                    </div>
                  </div>

                  <p className="action-description">{action.description}</p>

                  <div className="action-metadata">
                    <div className="metadata-item">
                      <span className="metadata-label">Created:</span>
                      <span className="metadata-value">{formatDate(action.createdDate)}</span>
                    </div>
                    {action.dueDate && (
                      <div className="metadata-item">
                        <span className="metadata-label">Due:</span>
                        <span className="metadata-value due-date">{formatDate(action.dueDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="action-lifecycle">
                    <h4>Action Lifecycle</h4>
                    <div className="lifecycle-timeline">
                      {action.lifecycle.map((step, index) => (
                        <div key={index} className="lifecycle-step">
                          <div className="lifecycle-indicator">
                            <div className="lifecycle-dot" />
                            {index < action.lifecycle.length - 1 && <div className="lifecycle-line" />}
                          </div>
                          <div className="lifecycle-content">
                            <div className="lifecycle-status">
                              <Badge
                                label={step.status.replace('_', ' ').toUpperCase()}
                                color={getStatusColor(step.status) as any}
                                
                              />
                              <span className="lifecycle-time">{formatDateTime(step.timestamp)}</span>
                            </div>
                            {step.note && <p className="lifecycle-note">{step.note}</p>}
                            {step.performer && (
                              <p className="lifecycle-performer">By: {step.performer}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {action.status === 'pending' && (
                    <div className="action-buttons">
                      <button
                        className="complete-button"
                        onClick={() => handleCompleteAction(action.id)}
                      >
                        Mark as Complete
                      </button>
                      <button
                        className="view-policy-button"
                        onClick={() => navigate(`/policy/${action.policyId}`)}
                      >
                        View Policy
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {completedActions.length > 0 && (
        <section className="actions-section">
          <h2>Completed Items ({completedActions.length})</h2>
          <div className="actions-inset">
            <div className="actions-list">
              {completedActions.map(action => (
                <div key={action.id} className="completed-action-item">
                  <div
                    className="completed-action-header"
                    onClick={() => setExpandedAction(expandedAction === action.id ? null : action.id)}
                  >
                    <div className="accordion-label">
                      <span>{action.title}</span>
                      <Badge
                        label={action.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(action.status) as any}
                      />
                    </div>
                    <span className="expand-icon">{expandedAction === action.id ? '▼' : '▶'}</span>
                  </div>
                  {expandedAction === action.id && (
                  <div className="accordion-content">
                    <p className="action-policy-link" onClick={() => navigate(`/policy/${action.policyId}`)}>
                      {action.policyNumber}
                    </p>
                    <p className="action-description">{action.description}</p>

                    <div className="action-lifecycle">
                      <h4>Action Lifecycle</h4>
                      <div className="lifecycle-timeline">
                        {action.lifecycle.map((step, index) => (
                          <div key={index} className="lifecycle-step">
                            <div className="lifecycle-indicator">
                              <div className="lifecycle-dot" />
                              {index < action.lifecycle.length - 1 && <div className="lifecycle-line" />}
                            </div>
                            <div className="lifecycle-content">
                              <div className="lifecycle-status">
                                <Badge
                                  label={step.status.replace('_', ' ').toUpperCase()}
                                  color={getStatusColor(step.status) as any}
                                  
                                />
                                <span className="lifecycle-time">{formatDateTime(step.timestamp)}</span>
                              </div>
                              {step.note && <p className="lifecycle-note">{step.note}</p>}
                              {step.performer && (
                                <p className="lifecycle-performer">By: {step.performer}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {actions.length === 0 && (
        <div className="no-actions">
          <h3>No actions at this time</h3>
          <p>You're all caught up! Check back later for any new actions or requests.</p>
        </div>
      )}
    </div>
  );
};

export default Actions;
