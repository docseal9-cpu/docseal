import { useState, useEffect } from 'react';

export default function AuditLogs({ session }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/logs', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Could not load security logs. Have you created the logs table in Supabase?');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (action) => {
    switch (action) {
      case 'UPLOAD': return 'badge badge-upload';
      case 'DECRYPT': return 'badge badge-decrypt';
      case 'DELETE': return 'badge badge-delete';
      default: return 'badge';
    }
  };

  return (
    <div className="animated">
      <h2 className="page-header">Security Audit Logs</h2>
      
      {error && <div className="alert-error">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading logs...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No actions logged yet.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Target File</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span className={getBadgeClass(log.action)}>{log.action}</span>
                  </td>
                  <td>{log.target_file}</td>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
