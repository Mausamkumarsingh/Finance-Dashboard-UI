import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import TransactionList from './components/TransactionList';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <FinanceProvider>
      <div className="app-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          <Header title={activeTab === 'dashboard' ? 'Dashboard Overview' : 'Transactions'} />
          
          {activeTab === 'dashboard' ? (
            <>
              <DashboardOverview />
              {/* Show top 5 latest transactions on dashboard */}
              <div style={{ marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--text-primary)' }}>Recent Transactions</h2>
                <TransactionList limit={5} />
              </div>
            </>
          ) : (
            <TransactionList />
          )}
        </main>
      </div>
    </FinanceProvider>
  );
}

export default App;
