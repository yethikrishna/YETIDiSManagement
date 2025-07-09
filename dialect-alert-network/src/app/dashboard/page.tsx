'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/components/AuthProvider';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Process alerts data for monthly visualization
const processAlertsByMonth = (alerts) => {
  const monthlyData = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Initialize monthly data
  months.forEach(month => {
    monthlyData[month] = { alerts: 0, dialects: new Set() };
  });

  // Process each alert
  alerts.forEach(alert => {
    const date = alert.timestamp.toDate();
    const month = months[date.getMonth()];
    monthlyData[month].alerts++;
    monthlyData[month].dialects.add(alert.dialect);
  });

  // Convert to chart format
  return months.map(month => ({
    name: month,
    alerts: monthlyData[month].alerts,
    dialects: monthlyData[month].dialects.size
  }));
};

// Initialize state for alerts and loading

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch alerts from Firestore
  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const alertsQuery = query(
          collection(db, 'alerts'),
          orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(alertsQuery);
        const alertsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAlerts(alertsData);
        setAlertData(processAlertsByMonth(alertsData));
      } catch (error) {
        console.error('Error fetching alerts:', error);
        toast.error('Failed to load alert data');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [user]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
      toast.success('Successfully signed out');
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dialect Alert Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.email || 'User'}
              </span>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isSigningOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dialect Recognition Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Dialect Recognition</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 mb-4">Record audio to detect and analyze dialects in real-time.</p>
          <Link
            href="/dashboard/recognition"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Recognition
            <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Alerts</h3>
                <div className="mt-1 text-3xl font-semibold text-gray-900">355</div>
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <span className="font-medium">+12%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-sm font-medium text-gray-500">Active Dialects</h3>
                <div className="mt-1 text-3xl font-semibold text-gray-900">24</div>
                <div className="mt-2 flex items-center text-sm text-blue-600">
                  <span className="font-medium">+3</span>
                  <span className="ml-1">new dialects added</span>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
                <div className="mt-1 text-3xl font-semibold text-gray-900">87%</div>
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <span className="font-medium">+5%</span>
                  <span className="ml-1">improvement</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Trends Chart */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Trends by Month</h2>
            <div className="h-80">
  {loading ? (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ) : (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={alertData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="alerts" fill="#3b82f6" name="Total Alerts" />
        <Bar dataKey="dialects" fill="#10b981" name="Dialects Involved" />
      </BarChart>
    </ResponsiveContainer>
  )}
</div>
          </div>

          {/* Recent Alerts Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dialect</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
  {loading ? (
    <tr>
      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
        Loading alerts...
      </td>
    </tr>
  ) : alerts.length === 0 ? (
    <tr>
      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
        No alerts found
      </td>
    </tr>
  ) : (
    alerts.slice(0, 5).map((alert) => (
      <tr key={alert.id}>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          AL-{new Date(alert.timestamp.toDate()).getFullYear()}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {alert.region || 'Unknown'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {alert.dialect || 'Unknown'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDistanceToNow(alert.timestamp.toDate(), { addSuffix: true })}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${alert.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {alert.status === 'resolved' ? 'Resolved' : 'In Progress'}
          </span>
        </td>
      </tr>
    ))
  )}
</tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}