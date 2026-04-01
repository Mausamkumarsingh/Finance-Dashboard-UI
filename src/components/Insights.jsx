import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { TrendingUp, AlertCircle, Award } from 'lucide-react';

const Insights = () => {
  const { transactions, balance } = useContext(FinanceContext);

  const insights = useMemo(() => {
    if (transactions.length === 0) return [];
    
    let res = [];
    
    // 1. Highest Spending Category
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length > 0) {
      const byCategory = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
        return acc;
      }, {});
      const maxCategory = Object.keys(byCategory).reduce((a, b) => byCategory[a] > byCategory[b] ? a : b);
      res.push({
        id: 'highest_spending',
        icon: <TrendingUp size={18} />,
        title: 'Top Category',
        desc: `You spent the most on **${maxCategory}** ($${byCategory[maxCategory].toFixed(2)}).`
      });
    }

    // 2. Monthly Comparison
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthExp = expenses.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const prevMonthExp = expenses.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    }).reduce((sum, t) => sum + parseFloat(t.amount), 0);

    if (prevMonthExp > 0) {
      const diff = currentMonthExp - prevMonthExp;
      const pct = Math.abs((diff / prevMonthExp) * 100).toFixed(0);
      res.push({
        id: 'monthly_comp',
        icon: <TrendingUp size={18} />,
        title: 'Monthly Spending',
        desc: diff > 0 
          ? `You've spent **${pct}% more** this month compared to last month.`
          : `Great job! You spent **${pct}% less** this month than last month.`
      });
    }

    // 3. Savings Observation
    if (balance > 0) {
      res.push({
        id: 'savings',
        icon: <Award size={18} />,
        title: 'Good Savings',
        desc: 'You have a positive net balance. Keep it up!'
      });
    } else if (balance < 0) {
      res.push({
        id: 'debt',
        icon: <AlertCircle size={18} />,
        title: 'Negative Balance',
        desc: 'You are currently spending more than you earn.'
      });
    }
    
    // 3. Largest single expense
    if (expenses.length > 0) {
        const topExpense = [...expenses].sort((a,b) => parseFloat(b.amount) - parseFloat(a.amount))[0];
        res.push({
            id: 'top_expense',
            icon: <AlertCircle size={18} />,
            title: 'Largest Expense',
            desc: `Your biggest single expense was ${topExpense.description || topExpense.category} for $${topExpense.amount}.`
        })
    }

    return res.slice(0, 3); // Max 3 insights
  }, [transactions, balance]);

  if (insights.length === 0) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.25rem' }}>Financial Insights</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {insights.map(item => (
          <div key={item.id} className="insights-card">
            <div className="insight-icon">
              {item.icon}
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{item.title}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {/* Simple bold parser */}
                {item.desc.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;
