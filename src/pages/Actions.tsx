import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Chip } from '@mui/material';
import { ArrowBack, ExpandMore, ChevronRight } from '@mui/icons-material';
import Spinner from '../components/Spinner';
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

  const getStatusChipSx = (status: string) => {
    switch (status) {
      case 'pending':   return { bgcolor: '#E8DE2320', border: '1px solid #E8DE234D' };
      case 'in_review': return { bgcolor: '#1B75BB20', border: '1px solid #1B75BB4D' };
      case 'approved':
      case 'completed': return { bgcolor: '#37A52620', border: '1px solid #37A5264D' };
      case 'rejected':  return { bgcolor: '#D02E2E20', border: '1px solid #D02E2E4D' };
      default:          return { bgcolor: '#80828520', border: '1px solid #8082854D' };
    }
  };

  const getPriorityChipSx = (priority: string) => {
    switch (priority) {
      case 'high':   return { bgcolor: '#D02E2E20', border: '1px solid #D02E2E4D' };
      case 'medium': return { bgcolor: '#F6921E20', border: '1px solid #F6921E4D' };
      case 'low':    return { bgcolor: '#1B75BB20', border: '1px solid #1B75BB4D' };
      default:       return { bgcolor: '#80828520', border: '1px solid #8082854D' };
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
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ color: '#1B75BB', fontWeight: 600 }}
        >
          Back to Dashboard
        </Button>
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
                <div
                    key={action.id}
                    className="action-item"
                    style={{
                      borderLeft: `4px solid ${action.priority === 'high' ? '#D02E2E' : action.priority === 'medium' ? '#F6921E' : '#1B75BB'}`,
                    }}
                  >
                  <div className="action-header">
                    <div className="action-title-area">
                      <h3>{action.title}</h3>
                      <p className="action-policy-link" onClick={() => navigate(`/policy/${action.policyId}`)}>
                        {action.policyNumber}
                      </p>
                    </div>
                    <div className="action-badges">
                      <Chip
                        label={action.priority.toUpperCase()}
                        size="small"
                        sx={{ ...getPriorityChipSx(action.priority), color: '#000000', fontWeight: 600 }}
                      />
                      <Chip
                        label={action.status.replace('_', ' ').toUpperCase()}
                        size="small"
                        sx={{ ...getStatusChipSx(action.status), color: '#000000', fontWeight: 600 }}
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
                              <Chip
                                label={step.status.replace('_', ' ').toUpperCase()}
                                size="small"
                                sx={{ ...getStatusChipSx(step.status), color: '#000000', fontWeight: 600 }}
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
                      <Button
                        variant="contained"
                        onClick={() => handleCompleteAction(action.id)}
                        sx={{
                          minHeight: 44,
                          fontWeight: 600,
                          bgcolor: '#1B75BB',
                          '&:hover': { bgcolor: '#155f99' },
                        }}
                      >
                        Mark as Complete
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/policy/${action.policyId}`)}
                        sx={{
                          minHeight: 44,
                          fontWeight: 600,
                          color: '#1B75BB',
                          borderColor: '#1B75BB',
                          '&:hover': { borderColor: '#155f99', color: '#155f99', bgcolor: '#1B75BB14' },
                        }}
                      >
                        View Policy
                      </Button>
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
                      <Chip
                        label={action.status.replace('_', ' ').toUpperCase()}
                        size="small"
                        sx={{ ...getStatusChipSx(action.status), color: '#000000', fontWeight: 600 }}
                      />
                    </div>
                    {expandedAction === action.id
                      ? <ExpandMore sx={{ color: '#808285', fontSize: 22 }} />
                      : <ChevronRight sx={{ color: '#808285', fontSize: 22 }} />
                    }
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
                                <Chip
                                  label={step.status.replace('_', ' ').toUpperCase()}
                                  size="small"
                                  sx={{ ...getStatusChipSx(step.status), color: '#000000', fontWeight: 600 }}
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
