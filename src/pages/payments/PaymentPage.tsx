import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, ArrowRightCircle, Wallet, Eye, EyeOff, X } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

type TransactionType = 'deposit' | 'withdraw' | 'transfer';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  sender: string;
  receiver: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

interface DealFunding {
  id: string;
  dealName: string;
  entrepreneur: string;
  fundingAmount: number;
  funded: number;
  status: 'active' | 'completed' | 'cancelled';
  date: string;
}

export const PaymentPage: React.FC = () => {
  const [balance, setBalance] = useState(50000);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<'wallet' | 'transactions' | 'deals'>('wallet');
  const [transactionTab, setTransactionTab] = useState<TransactionType>('deposit');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'deposit', amount: 10000, sender: 'Bank Account', receiver: 'You', status: 'completed', date: '2026-07-01' },
    { id: '2', type: 'transfer', amount: 10000, sender: 'You', receiver: 'Sarah Johnson', status: 'completed', date: '2026-07-02' },
    { id: '3', type: 'withdraw', amount: 2000, sender: 'You', receiver: 'Bank Account', status: 'pending', date: '2026-07-03' },
    { id: '4', type: 'transfer', amount: 8000, sender: 'You', receiver: 'David Chen', status: 'completed', date: '2026-07-04' },
    { id: '5', type: 'deposit', amount: 15000, sender: 'Investment Fund', receiver: 'You', status: 'completed', date: '2026-06-28' },
  ]);

  const [dealFundings, setDealFundings] = useState<DealFunding[]>([
    { id: 'd1', dealName: 'TechWave Series A', entrepreneur: 'Sarah Johnson', fundingAmount: 50000, funded: 35000, status: 'active', date: '2026-07-01' },
    { id: 'd2', dealName: 'GreenLife Seed', entrepreneur: 'David Chen', fundingAmount: 30000, funded: 25000, status: 'active', date: '2026-07-02' },
    { id: 'd3', dealName: 'CloudSync Series B', entrepreneur: 'Alex Kim', fundingAmount: 100000, funded: 100000, status: 'completed', date: '2026-06-15' },
  ]);

  const handleTransaction = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return alert('Enter a valid amount!');
    if ((transactionTab === 'withdraw' || transactionTab === 'transfer') && amt > balance) {
      return alert('Insufficient balance!');
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: transactionTab,
      amount: amt,
      sender: transactionTab === 'deposit' ? 'External' : 'You',
      receiver: transactionTab === 'deposit' ? 'You' : recipient || 'Recipient',
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    if (transactionTab === 'deposit') {
      setBalance(prev => prev + amt);
    } else {
      setBalance(prev => prev - amt);
    }
    
    setTransactions(prev => [newTransaction, ...prev]);
    setAmount('');
    setRecipient('');
    setShowModal(false);
  };

  const handleFundDeal = (dealId: string) => {
    const deal = dealFundings.find(d => d.id === dealId);
    if (!deal) return;

    const remainingFunding = deal.fundingAmount - deal.funded;
    if (remainingFunding <= 0) return;
    if (balance < remainingFunding) return alert('Insufficient balance to complete funding!');

    setBalance(prev => prev - remainingFunding);
    setDealFundings(
      dealFundings.map(d =>
        d.id === dealId ? { ...d, funded: d.fundingAmount, status: 'completed' } : d
      )
    );

    setTransactions(prev => [
      {
        id: Date.now().toString(),
        type: 'transfer',
        amount: remainingFunding,
        sender: 'You',
        receiver: deal.entrepreneur,
        status: 'completed',
        date: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">💳 Payments & Wallet</h1>
        <p className="text-gray-600">Manage your funds, transactions, and deal funding</p>
      </div>

      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-400">
        <CardBody className="text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Wallet Balance</p>
              <h2 className="text-4xl font-bold">
                {showBalance ? `$${balance.toLocaleString()}` : '••••••'}
              </h2>
              <p className="text-blue-100 text-xs mt-1">Available for transactions</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition"
              >
                {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              <Wallet size={48} className="text-blue-100" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 bg-white rounded-lg">
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex-1 px-4 py-3 font-medium border-b-2 transition ${
            activeTab === 'wallet'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          💳 Wallet
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 px-4 py-3 font-medium border-b-2 transition ${
            activeTab === 'transactions'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📊 Transactions
        </button>
        <button
          onClick={() => setActiveTab('deals')}
          className={`flex-1 px-4 py-3 font-medium border-b-2 transition ${
            activeTab === 'deals'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🤝 Deal Funding
        </button>
      </div>

      {/* Wallet Tab */}
      {activeTab === 'wallet' && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Manage Funds</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => { setTransactionTab('deposit'); setShowModal(true); }}
                className="p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 transition text-center"
              >
                <div className="text-2xl mb-2">⬇️</div>
                <p className="font-medium text-gray-900">Deposit</p>
                <p className="text-xs text-gray-500">Add funds to wallet</p>
              </button>

              <button
                onClick={() => { setTransactionTab('withdraw'); setShowModal(true); }}
                className="p-4 border-2 border-red-200 rounded-xl hover:bg-red-50 transition text-center"
              >
                <div className="text-2xl mb-2">⬆️</div>
                <p className="font-medium text-gray-900">Withdraw</p>
                <p className="text-xs text-gray-500">Withdraw to bank</p>
              </button>

              <button
                onClick={() => { setTransactionTab('transfer'); setShowModal(true); }}
                className="p-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition text-center"
              >
                <div className="text-2xl mb-2">↔️</div>
                <p className="font-medium text-gray-900">Transfer</p>
                <p className="text-xs text-gray-500">Send to others</p>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total Deposited</p>
                    <p className="text-2xl font-bold text-green-600">$25,000</p>
                  </div>
                  <ArrowDownCircle size={24} className="text-green-600" />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total Transferred</p>
                    <p className="text-2xl font-bold text-blue-600">$18,000</p>
                  </div>
                  <ArrowRightCircle size={24} className="text-blue-600" />
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">$2,000</p>
                  </div>
                  <ArrowUpCircle size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">📋 Transaction History</h2>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-left py-3 px-2">Amount</th>
                    <th className="text-left py-3 px-2">Sender</th>
                    <th className="text-left py-3 px-2">Receiver</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-700">
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-semibold text-gray-800">${tx.amount.toLocaleString()}</td>
                      <td className="py-3 px-2 text-gray-600">{tx.sender}</td>
                      <td className="py-3 px-2 text-gray-600">{tx.receiver}</td>
                      <td className="py-3 px-2">
                        <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'error'}>
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-gray-500 text-xs">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Deal Funding Tab */}
      {activeTab === 'deals' && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">🤝 Deal Funding Opportunities</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {dealFundings.map(deal => (
                <div key={deal.id} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{deal.dealName}</h3>
                      <p className="text-sm text-gray-500">Entrepreneur: {deal.entrepreneur}</p>
                    </div>
                    <Badge variant={deal.status === 'completed' ? 'success' : deal.status === 'active' ? 'primary' : 'error'}>
                      {deal.status}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700">Funding Progress</span>
                      <span className="font-medium">${deal.funded.toLocaleString()} / ${deal.fundingAmount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${(deal.funded / deal.fundingAmount) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {deal.status === 'active' && deal.funded < deal.fundingAmount && (
                    <Button
                      onClick={() => handleFundDeal(deal.id)}
                      className="w-full"
                      size="sm"
                    >
                      💰 Fund Deal (${(deal.fundingAmount - deal.funded).toLocaleString()})
                    </Button>
                  )}
                  {deal.status === 'completed' && (
                    <p className="text-center text-xs text-green-600 font-medium">✓ Funding Complete</p>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex justify-between items-center border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                {transactionTab === 'deposit' ? '💳 Deposit Funds' : transactionTab === 'withdraw' ? '💸 Withdraw Funds' : '📤 Transfer Funds'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  fullWidth
                />
              </div>

              {(transactionTab === 'transfer' || transactionTab === 'withdraw') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {transactionTab === 'transfer' ? 'Recipient Name' : 'Bank Account'}
                  </label>
                  <Input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder={transactionTab === 'transfer' ? 'Enter recipient name' : 'Enter bank account'}
                    fullWidth
                  />
                </div>
              )}

              {transactionTab === 'transfer' && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-700 font-medium">💡 Investor → Entrepreneur</p>
                  <p className="text-xs text-blue-600 mt-1">Transfer funds to fund an entrepreneur's deal</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button onClick={handleTransaction} className="flex-1">
                  Confirm
                </Button>
                <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};