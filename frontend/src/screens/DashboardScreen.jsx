import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import Chart from 'react-google-charts';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { fetchDashboardSummary } from '../redux/dashboardSlice';
import { colors, components, utils } from '../styles/theme';
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

export default function DashboardScreen() {
  const dispatch = useDispatch();
  const { loading, error, summary } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  if (loading) return <div className={components.states.loading}><LoadingBox /></div>;
  if (error) return <div className={components.states.error}><MessageBox variant="danger">{error}</MessageBox>;</div>;

  const usersCount = summary?.users?.[0]?.numUsers || 0;
  const ordersCount = summary?.orders?.[0]?.numOrders || 0;
  const totalSales = summary?.orders?.[0]?.totalSales?.toFixed(2) || '0.00';

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>Admin Dashboard - EcomStore</title>
      </Helmet>
      
      <div className={components.layout.container}>
        <div className="py-8">
          {/* Dashboard Header */}
          <div className="flex items-center mb-8">
            <ChartBarIcon className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className={components.typography.h2}>Admin Dashboard</h1>
              <p className={colors.text.secondary}>Overview of your store performance</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`${components.card.base} p-6`}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className={`${colors.text.secondary} text-sm font-medium`}>Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{usersCount}</p>
                </div>
              </div>
            </div>
            
            <div className={`${components.card.base} p-6`}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                  <ShoppingBagIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className={`${colors.text.secondary} text-sm font-medium`}>Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{ordersCount}</p>
                </div>
              </div>
            </div>
            
            <div className={`${components.card.base} p-6`}>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mr-4">
                  <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className={`${colors.text.secondary} text-sm font-medium`}>Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">${totalSales}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sales Chart */}
            <div className={components.card.base}>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Daily Sales</h3>
                </div>
                
                {!summary?.dailyOrders || summary.dailyOrders.length === 0 ? (
                  <div className={`${utils.centerText} py-12`}>
                    <ArrowTrendingUpIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className={colors.text.secondary}>No sales data available</p>
                  </div>
                ) : (
                  <div className="h-80">
                    <Chart
                      width="100%"
                      height="100%"
                      chartType="AreaChart"
                      loader={
                        <div className={`${utils.centerText} py-12`}>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className={`${colors.text.secondary} mt-2`}>Loading chart...</p>
                        </div>
                      }
                      data={[
                        ['Date', 'Sales'],
                        ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                      ]}
                      options={{
                        title: '',
                        hAxis: { title: 'Date' },
                        vAxis: { title: 'Sales ($)' },
                        backgroundColor: 'transparent',
                        colors: ['#3B82F6'],
                        chartArea: { width: '80%', height: '70%' },
                        legend: { position: 'none' }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Categories Chart */}
            <div className={components.card.base}>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <ChartPieIcon className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Product Categories</h3>
                </div>
                
                {!summary?.productCategories || summary.productCategories.length === 0 ? (
                  <div className={`${utils.centerText} py-12`}>
                    <ChartPieIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className={colors.text.secondary}>No category data available</p>
                  </div>
                ) : (
                  <div className="h-80">
                    <Chart
                      width="100%"
                      height="100%"
                      chartType="PieChart"
                      loader={
                        <div className={`${utils.centerText} py-12`}>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                          <p className={`${colors.text.secondary} mt-2`}>Loading chart...</p>
                        </div>
                      }
                      data={[
                        ['Category', 'Products'],
                        ...summary.productCategories.map((x) => [x._id, x.count]),
                      ]}
                      options={{
                        title: '',
                        backgroundColor: 'transparent',
                        colors: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'],
                        chartArea: { width: '90%', height: '80%' },
                        legend: { position: 'bottom', alignment: 'center' }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`${components.card.base} mt-8 p-6`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className={`${components.button.secondary} justify-center`}>
                View All Orders
              </button>
              <button className={`${components.button.secondary} justify-center`}>
                Manage Products
              </button>
              <button className={`${components.button.secondary} justify-center`}>
                View Users
              </button>
              <button className={`${components.button.secondary} justify-center`}>
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
