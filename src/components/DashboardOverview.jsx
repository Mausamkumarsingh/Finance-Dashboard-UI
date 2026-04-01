import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Insights from './Insights';
import { DollarSign, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const DashboardOverview = () => {
  const { transactions, totalIncome, totalExpense, balance } = useContext(FinanceContext);

  // Group by date for the line chart (trends)
  const trendData = useMemo(() => {
    const grouped = transactions.reduce((acc, curr) => {
      const date = curr.date;
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0, balance: 0 };
      }
      if (curr.type === 'income') acc[date].income += parseFloat(curr.amount);
      if (curr.type === 'expense') acc[date].expense += parseFloat(curr.amount);
      return acc;
    }, {});
    
    // Convert to sorted array
    let runningBalance = balance - totalIncome + totalExpense; // Start from an assumed historical balance of 0 just for chart relative?
    // Let's just do a simpler running balance or daily net.
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  // Group by category for pie chart (expenses)
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
      return acc;
    }, {});
    
    return Object.keys(grouped).map(key => ({
      name: key,
      value: grouped[key]
    })).sort((a,b) => b.value - a.value); // sort descending
  }, [transactions]);

  return (
    <div>
      {/* Overview Cards */}
      <div className="summary-cards">
        <div className="card">
          <div className="card-header">
            <span>Total Balance</span>
            <Wallet size={20} color="var(--accent)" />
          </div>
          <div className="card-value">{formatCurrency(balance)}</div>
        </div>
        <div className="card">
          <div className="card-header">
            <span>Total Income</span>
            <ArrowUpRight size={20} color="var(--success)" />
          </div>
          <div className="card-value value-positive">+{formatCurrency(totalIncome)}</div>
        </div>
        <div className="card">
          <div className="card-header">
            <span>Total Expenses</span>
            <ArrowDownRight size={20} color="var(--danger)" />
          </div>
          <div className="card-value value-negative">-{formatCurrency(totalExpense)}</div>
        </div>
      </div>

      <Insights />

      {/* Charts Section */}
      <div className="charts-grid mt-4" style={{ marginTop: '2rem' }}>
        <div className="chart-card">
          <h3>Income vs Expense Trends</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="income" stroke="var(--success)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expense" stroke="var(--danger)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Expense by Category</h3>
          <div style={{ height: 300 }}>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No expenses recorded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
