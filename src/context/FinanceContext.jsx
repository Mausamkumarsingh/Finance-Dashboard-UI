import React, { createContext, useState, useEffect } from 'react';

// Generate relative dates so the app looks "live" and Monthly Comparison triggers
const getRelativeDate = (daysOffset) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

const initialTransactions = [
  { id: '1', date: getRelativeDate(-45), amount: 5000, category: 'Salary', type: 'income', description: 'Past Salary' },
  { id: '2', date: getRelativeDate(-35), amount: 1400, category: 'Rent', type: 'expense', description: 'Past Rent' },
  { id: '3', date: getRelativeDate(-30), amount: 300, category: 'Groceries', type: 'expense', description: 'Supermarket' },
  { id: '4', date: getRelativeDate(-15), amount: 5000, category: 'Salary', type: 'income', description: 'Current Salary' },
  { id: '5', date: getRelativeDate(-10), amount: 1400, category: 'Rent', type: 'expense', description: 'Current Rent' },
  { id: '6', date: getRelativeDate(-5), amount: 80, category: 'Entertainment', type: 'expense', description: 'Movie night' },
  { id: '7', date: getRelativeDate(-2), amount: 150, category: 'Shopping', type: 'expense', description: 'New Shoes' },
  { id: '8', date: getRelativeDate(0), amount: 45, category: 'Utilities', type: 'expense', description: 'Internet Bill' },
];

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  // Try to load from local storage first, fallback to initial data
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('fin_dash_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  
  const [role, setRole] = useState('admin'); // 'viewer' or 'admin'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finance_theme') || 'light';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('finance_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Persist to local storage whenever transactions change
  useEffect(() => {
    localStorage.setItem('fin_dash_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTx) => {
    setTransactions(prev => [{ ...newTx, id: Date.now().toString() }, ...prev].sort((a,b) => new Date(b.date) - new Date(a.date)));
  };

  const editTransaction = (id, updatedTx) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updatedTx } : tx).sort((a,b) => new Date(b.date) - new Date(a.date)));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  // Derived state for the dashboard
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
  const balance = totalIncome - totalExpense;

  return (
    <FinanceContext.Provider value={{
      transactions,
      addTransaction,
      editTransaction,
      deleteTransaction,
      role,
      setRole,
      theme,
      toggleTheme,
      totalIncome,
      totalExpense,
      balance
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
