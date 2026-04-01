import React, { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { Search, Plus, Trash2, Filter, Download, Edit } from 'lucide-react';

const TransactionList = ({ limit, hideFilters = false }) => {
  const { transactions, deleteTransaction, editTransaction, role, addTransaction } = useContext(FinanceContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    description: '',
    type: 'expense'
  });

  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }

    if (searchTerm) {
      const lowerReq = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.category.toLowerCase().includes(lowerReq) || 
        (t.description && t.description.toLowerCase().includes(lowerReq))
      );
    }
    
    // simple sort by date reverse chronological happens initially in context, 
    // but just to be safe:
    result = [...result].sort((a,b) => new Date(b.date) - new Date(a.date));

    // applying limit for dashboard usage
    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }, [transactions, filterType, searchTerm, limit]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    if (editingId) {
      editTransaction(editingId, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
    } else {
      addTransaction({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    }
    
    // Reset and close
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: '',
      description: '',
      type: 'expense'
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const openEditModal = (tx) => {
    setFormData({
      date: tx.date,
      amount: tx.amount,
      category: tx.category,
      description: tx.description || '',
      type: tx.type
    });
    setEditingId(tx.id);
    setIsModalOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(tx => [
        tx.date,
        tx.type,
        `"${tx.category}"`,
        `"${tx.description || ''}"`,
        tx.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions_export.csv';
    link.click();
  };

  return (
    <div className="transactions-section">
      {!hideFilters && (
        <div className="transactions-header">
          <div className="transactions-actions">
            <div className="input-group">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="role-selector" style={{ background: 'transparent' }}>
              <Filter size={18} color="var(--text-secondary)" />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={exportToCSV} title="Export to CSV" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <Download size={18} /> Export
            </button>
            {role === 'admin' && (
              <button className="btn btn-primary" onClick={() => { setEditingId(null); setIsModalOpen(true); }}>
                <Plus size={18} /> Add New
              </button>
            )}
          </div>
        </div>
      )}

      {/* When used in Dashboard Overview, we might just want to show the 'Add New' button even if search is hidden but only if Admin. Let's make it simpler. */}
      {hideFilters && role === 'admin' && (
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
             <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Add Transaction
            </button>
        </div>
      )}

      <div className="table-container">
        {filteredTransactions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                {role === 'admin' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => (
                <tr key={tx.id}>
                  <td>{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{tx.description || '-'}</td>
                  <td>{tx.category}</td>
                  <td>
                    <span className={`type-badge type-${tx.type}`}>
                      {tx.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }} className={tx.type === 'income' ? 'value-positive' : ''}>
                    {tx.type === 'income' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                  </td>
                  {role === 'admin' && (
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button 
                          className="btn-danger" 
                          onClick={() => openEditModal(tx)}
                          title="Edit transaction"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className="btn-danger" 
                          onClick={() => deleteTransaction(tx.id)}
                          title="Delete transaction"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No transactions found.</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>Type</label>
                <select 
                  className="form-control"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  className="form-control"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  className="form-control"
                  placeholder="0.00"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Groceries, Salary, Rent"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Brief note"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setIsModalOpen(false); setEditingId(null); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update' : 'Save'} Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
