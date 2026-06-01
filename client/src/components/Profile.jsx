import { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

export default function Profile({ session }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Form State initialized from session metadata
  const metadata = session?.user?.user_metadata || {};
  const [formData, setFormData] = useState({
    full_name: metadata.full_name || '',
    username: metadata.username || '',
    dob: metadata.dob || '',
    mobile: metadata.mobile || '',
    gender: metadata.gender || '',
    avatar_base64: metadata.avatar_base64 || ''
  });

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar_base64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: formData
      });

      if (error) throw error;
      
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Revert to original metadata
    setFormData({
      full_name: metadata.full_name || '',
      username: metadata.username || '',
      dob: metadata.dob || '',
      mobile: metadata.mobile || '',
      gender: metadata.gender || '',
      avatar_base64: metadata.avatar_base64 || ''
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="animated">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="page-header" style={{ marginBottom: 0 }}>My Profile</h2>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <div className="table-container profile-card">
        {error && <div className="alert-error" style={{ width: '100%', marginBottom: '1rem' }}>{error}</div>}
        
        <input 
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          ref={fileInputRef}
          onChange={handleAvatarChange}
        />

        <div 
          className="profile-avatar-wrapper" 
          onClick={handleAvatarClick}
          style={{ cursor: isEditing ? 'pointer' : 'default', position: 'relative' }}
        >
          {formData.avatar_base64 ? (
            <img src={formData.avatar_base64} alt="Avatar" className="profile-avatar" style={{ border: isEditing ? '4px solid #6366f1' : '4px solid var(--card-border)' }} />
          ) : (
            <div className="profile-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1f2937', border: isEditing ? '4px solid #6366f1' : '4px solid var(--card-border)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
          )}
          {isEditing && (
            <div style={{ position: 'absolute', bottom: '2rem', right: '0', background: '#6366f1', padding: '0.5rem', borderRadius: '50%', color: 'white' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem', width: '100%', maxWidth: '300px' }}>
            <input 
              name="full_name"
              className="input-field" 
              placeholder="Full Name" 
              value={formData.full_name} 
              onChange={handleInputChange} 
              style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700 }}
            />
            <input 
              name="username"
              className="input-field" 
              placeholder="Username" 
              value={formData.username} 
              onChange={handleInputChange} 
              style={{ textAlign: 'center', color: 'var(--text-secondary)' }}
            />
          </div>
        ) : (
          <>
            <h3 className="profile-name">{formData.full_name || 'Unknown User'}</h3>
            <p className="profile-username">@{formData.username || 'unknown'}</p>
          </>
        )}

        <div className="profile-details">
          <div className="profile-item">
            <span className="profile-item-label">Security Email</span>
            <span className="profile-item-value">{session?.user?.email}</span>
          </div>
          <div className="profile-item">
            <span className="profile-item-label">Date of Birth</span>
            {isEditing ? (
              <input name="dob" type="date" className="input-field" style={{ width: 'auto', padding: '0.25rem 0.5rem' }} value={formData.dob} onChange={handleInputChange} />
            ) : (
              <span className="profile-item-value">{formData.dob || 'Not provided'}</span>
            )}
          </div>
          <div className="profile-item">
            <span className="profile-item-label">Mobile Number</span>
            {isEditing ? (
              <input name="mobile" type="tel" className="input-field" style={{ width: 'auto', padding: '0.25rem 0.5rem' }} value={formData.mobile} onChange={handleInputChange} />
            ) : (
              <span className="profile-item-value">{formData.mobile || 'Not provided'}</span>
            )}
          </div>
          <div className="profile-item">
            <span className="profile-item-label">Gender</span>
            {isEditing ? (
              <select name="gender" className="input-field" style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 0.5rem' }} value={formData.gender} onChange={handleInputChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            ) : (
              <span className="profile-item-value" style={{ textTransform: 'capitalize' }}>{formData.gender || 'Not provided'}</span>
            )}
          </div>
          <div className="profile-item">
            <span className="profile-item-label">Vault Created</span>
            <span className="profile-item-value">{new Date(session?.user?.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {isEditing && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', width: '100%', maxWidth: '500px' }}>
            <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCancel} disabled={loading}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        )}
      </div>
    </div>
  );
}
