import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useSocket } from '../../contexts/SocketContext';

const ApiTester: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { socket, connected } = useSocket();
  
  const [triangleData, setTriangleData] = useState<any>(null);
  const [triangleLoading, setTriangleLoading] = useState(false);
  const [triangleError, setTriangleError] = useState<string | null>(null);
  
  const [transactionData, setTransactionData] = useState<any>(null);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  
  const [transactionAmount, setTransactionAmount] = useState('0.1');
  const [transactionType, setTransactionType] = useState('deposit');

  // Test triangle data fetching
  const fetchTriangleData = async () => {
    setTriangleLoading(true);
    setTriangleError(null);
    
    try {
      const response = await fetch('/api/triangle');
      if (response.ok) {
        const data = await response.json();
        setTriangleData(data);
        addNotification({
          userId: user?.id || 'system',
          title: 'Triangle Data Fetched',
          message: 'Successfully retrieved triangle data',
          type: 'success',
          read: false,
        });
      } else {
        setTriangleError('Failed to fetch triangle data');
        addNotification({
          userId: user?.id || 'system',
          title: 'Triangle Data Error',
          message: 'Failed to fetch triangle data',
          type: 'error',
          read: false,
        });
      }
    } catch (err) {
      setTriangleError('An error occurred while fetching triangle data');
      addNotification({
        userId: user?.id || 'system',
        title: 'Triangle Data Error',
        message: 'An error occurred while fetching triangle data',
        type: 'error',
        read: false,
      });
    } finally {
      setTriangleLoading(false);
    }
  };

  // Test transaction creation
  const createTransaction = async () => {
    setTransactionLoading(true);
    setTransactionError(null);
    
    try {
      const response = await fetch('/api/transactions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(transactionAmount),
          type: transactionType,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTransactionData(data);
        addNotification({
          userId: user?.id || 'system',
          title: 'Transaction Created',
          message: `Successfully created ${transactionType} transaction`,
          type: 'success',
          read: false,
        });
      } else {
        setTransactionError(data.error || 'Failed to create transaction');
        addNotification({
          userId: user?.id || 'system',
          title: 'Transaction Error',
          message: data.error || 'Failed to create transaction',
          type: 'error',
          read: false,
        });
      }
    } catch (err) {
      setTransactionError('An error occurred while creating transaction');
      addNotification({
        userId: user?.id || 'system',
        title: 'Transaction Error',
        message: 'An error occurred while creating transaction',
        type: 'error',
        read: false,
      });
    } finally {
      setTransactionLoading(false);
    }
  };

  // Test socket connection by sending a manual notification
  const testSocketNotification = () => {
    if (socket && connected) {
      socket.emit('test_notification', {
        userId: user?.id || 'system',
        message: 'This is a test notification from the frontend',
      });
      
      addNotification({
        userId: user?.id || 'system',
        title: 'Socket Test',
        message: 'Test notification sent via socket',
        type: 'info',
        read: false,
      });
    } else {
      addNotification({
        userId: user?.id || 'system',
        title: 'Socket Error',
        message: 'Socket not connected',
        type: 'error',
        read: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Integration Tester</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Socket Connection Status */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Socket Connection</h2>
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <button
              onClick={testSocketNotification}
              disabled={!connected}
              className={`w-full py-2 px-4 rounded-md font-medium ${
                connected
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Test Socket Notification
            </button>
          </div>
          
          {/* Triangle Data */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Triangle Data</h2>
            <button
              onClick={fetchTriangleData}
              disabled={triangleLoading}
              className={`w-full py-2 px-4 rounded-md font-medium mb-4 ${
                triangleLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {triangleLoading ? 'Loading...' : 'Fetch Triangle Data'}
            </button>
            
            {triangleError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md mb-4">
                {triangleError}
              </div>
            )}
            
            {triangleData && (
              <div className="p-3 bg-gray-50 rounded-md overflow-auto max-h-60">
                <pre className="text-xs">{JSON.stringify(triangleData, null, 2)}</pre>
              </div>
            )}
          </div>
          
          {/* Transaction Creation */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Transaction</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  step="0.01"
                  min="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="deposit">Deposit</option>
                  <option value="payout">Payout</option>
                  <option value="referral_bonus">Referral Bonus</option>
                  <option value="withdrawal">Withdrawal</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={createTransaction}
              disabled={transactionLoading}
              className={`w-full py-2 px-4 rounded-md font-medium mb-4 ${
                transactionLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {transactionLoading ? 'Processing...' : 'Create Transaction'}
            </button>
            
            {transactionError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md mb-4">
                {transactionError}
              </div>
            )}
            
            {transactionData && (
              <div className="p-3 bg-gray-50 rounded-md overflow-auto max-h-60">
                <pre className="text-xs">{JSON.stringify(transactionData, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;