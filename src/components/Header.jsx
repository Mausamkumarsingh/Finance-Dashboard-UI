import React, { useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { User, ShieldUser, Moon, Sun } from 'lucide-react';

const Header = ({ title }) => {
  const { role, setRole, theme, toggleTheme } = useContext(FinanceContext);

  return (
    <header className="header">
      <h1>{title}</h1>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button 
          onClick={toggleTheme} 
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="role-selector">
        {role === 'admin' ? <ShieldUser size={18} color="var(--danger)" /> : <User size={18} color="var(--success)" />}
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin Role</option>
          <option value="viewer">Viewer Role</option>
        </select>
        <span className={`role-badge ${role === 'admin' ? 'role-admin' : 'role-viewer'}`}>
          {role}
        </span>
      </div>
      </div>
    </header>
  );
};

export default Header;
