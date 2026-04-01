import React from 'react';
import { LayoutDashboard, Receipt, PieChart } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <PieChart className="text-accent" size={28} color="var(--accent)" />
        <span>FinDash</span>
      </div>
      
      <nav className="sidebar-nav">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          style={{ width: '100%', border: 'none', background: activeTab === 'dashboard' ? 'var(--accent)' : 'transparent', textAlign: 'left', fontSize: '1rem'}}
        >
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </button>
        <button 
          onClick={() => setActiveTab('transactions')} 
          className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
          style={{ width: '100%', border: 'none', background: activeTab === 'transactions' ? 'var(--accent)' : 'transparent', textAlign: 'left', fontSize: '1rem'}}
        >
          <Receipt size={20} />
          <span>Transactions</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
