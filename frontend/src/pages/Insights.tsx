import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  CreditCard, 
  BarChart3,
  PieChart,
  Calendar,
  Users,
  Package,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface FinancialOverview {
  totalSales: number;
  totalPurchases: number;
  totalExpenses: number;
  paymentMethods: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  salesByDate: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
}

interface TopProduct {
  _id: string;
  totalQuantity: number;
  totalAmount: number;
  count: number;
}

interface TopCustomer {
  _id: string;
  totalAmount: number;
  invoiceCount: number;
  avgOrderValue: number;
}

interface PaymentAnalytics {
  paymentFlow: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  paymentMethods: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  dailyPayments: Array<{
    _id: string;
    received: number;
    paid: number;
  }>;
}

const Insights: React.FC = () => {
  const [overview, setOverview] = useState<FinancialOverview | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [paymentAnalytics, setPaymentAnalytics] = useState<PaymentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchInsights();
  }, [dateRange, startDate, endDate]);

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      // Map dateRange to period format
      const periodMap = {
        '7': '7days',
        '30': '30days',
        '90': '90days',
        '365': '1year'
      };
      const period = periodMap[dateRange] || '30days';

      // Fetch all analytics data in parallel
      const [overviewRes, productsRes, customersRes, paymentsRes] = await Promise.all([
        fetch(`https://gst-backend-production-8aff.up.railway.app/api/analytics/overview?period=${period}&${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://gst-backend-production-8aff.up.railway.app/api/analytics/top-products?period=${period}&${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://gst-backend-production-8aff.up.railway.app/api/analytics/top-customers?period=${period}&${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://gst-backend-production-8aff.up.railway.app/api/analytics/payments?period=${period}&${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (overviewRes.ok) {
        const data = await overviewRes.json();
        setOverview(data);
      } else {
        setError('Failed to fetch overview data');
      }

      if (productsRes.ok) {
        const data = await productsRes.json();
        setTopProducts(data);
      } else {
        setError('Failed to fetch products data');
      }

      if (customersRes.ok) {
        const data = await customersRes.json();
        setTopCustomers(data);
      } else {
        setError('Failed to fetch customers data');
      }

      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPaymentAnalytics(data);
      } else {
        setError('Failed to fetch payments data');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const periodMap = {
        '7': '7days',
        '30': '30days',
        '90': '90days',
        '365': '1year'
      };
      const period = periodMap[dateRange] || '30days';
      
      const response = await fetch('https://gst-backend-production-8aff.up.railway.app/api/analytics/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ period })
      });

      if (response.ok) {
        // Refresh data after update
        fetchInsights();
      } else {
        setError('Failed to update analytics');
      }
    } catch (error) {
      setError('Network error while updating analytics');
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getPaymentMethodColor = (method: string) => {
    const colors: { [key: string]: string } = {
      'Cash': 'bg-green-500',
      'UPI': 'bg-blue-500',
      'Bank Transfer': 'bg-purple-500',
      'Card': 'bg-orange-500',
      'Cheque': 'bg-gray-500',
      'Net Banking': 'bg-indigo-500'
    };
    return colors[method] || 'bg-gray-500';
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Cash': <DollarSign className="w-4 h-4" />,
      'UPI': <CreditCard className="w-4 h-4" />,
      'Bank Transfer': <BarChart3 className="w-4 h-4" />,
      'Card': <CreditCard className="w-4 h-4" />,
      'Cheque': <DollarSign className="w-4 h-4" />,
      'Net Banking': <BarChart3 className="w-4 h-4" />
    };
    return icons[method] || <DollarSign className="w-4 h-4" />;
  };

  // Chart colors
  const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  // Format chart data
  const formatSalesChartData = () => {
    if (!overview?.salesByDate) return [];
    return overview.salesByDate.map(item => ({
      date: formatDate(item._id),
      sales: item.total,
      orders: item.count
    }));
  };

  const formatPaymentMethodsChartData = () => {
    if (!paymentAnalytics?.paymentMethods) return [];
    return paymentAnalytics.paymentMethods.map((method, index) => ({
      name: method._id,
      value: method.total,
      count: method.count,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }));
  };

  const formatRevenueChartData = () => {
    return [
      {
        category: 'Sales',
        amount: overview?.totalSales || 0,
        color: '#10B981'
      },
      {
        category: 'Purchases',
        amount: overview?.totalPurchases || 0,
        color: '#3B82F6'
      },
      {
        category: 'Expenses',
        amount: overview?.totalExpenses || 0,
        color: '#EF4444'
      }
    ];
  };

  // Custom tooltip formatter
  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'orders' || name === 'count') {
      return [value, name];
    }
    return [formatAmount(value), name];
  };


  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Insights & Analytics</h1>
              <p className="mt-2 text-gray-600">Comprehensive business analytics and financial insights</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={updateAnalytics}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Update Analytics
              </Button>
              <Button variant="outline" onClick={fetchInsights}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Date Range Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Date Range Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quick Select
                  </label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="365">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                      setDateRange('30');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Net Profit</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatAmount((overview?.totalSales || 0) - (overview?.totalPurchases || 0) - (overview?.totalExpenses || 0))}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Top Customers</p>
                    <p className="text-2xl font-bold text-indigo-600">{topCustomers.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-indigo-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Top Products</p>
                    <p className="text-2xl font-bold text-orange-600">{topProducts.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Payment Methods</p>
                    <p className="text-2xl font-bold text-cyan-600">{paymentAnalytics?.paymentMethods?.length || 0}</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatAmount(overview?.totalSales || 0)}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Purchases</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatAmount(overview?.totalPurchases || 0)}
                    </p>
                  </div>
                  <ShoppingCart className="w-12 h-12 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Expenses</p>
                    <p className="text-3xl font-bold text-red-600">
                      {formatAmount(overview?.totalExpenses || 0)}
                    </p>
                  </div>
                  <TrendingDown className="w-12 h-12 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Payment Methods Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Payment Methods Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentAnalytics?.paymentMethods && paymentAnalytics.paymentMethods.length > 0 ? (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={formatPaymentMethodsChartData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {formatPaymentMethodsChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={formatTooltipValue} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {paymentAnalytics.paymentMethods.map((method, index) => (
                        <div key={method._id} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          ></div>
                          <span className="font-medium">{method._id}</span>
                          <span className="text-gray-500">({method.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PieChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No payment data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Revenue Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Revenue Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatRevenueChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={formatTooltipValue} />
                    <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                      {formatRevenueChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Daily Payment Trends */}
          {paymentAnalytics?.dailyPayments && paymentAnalytics.dailyPayments.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Daily Payment Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={paymentAnalytics.dailyPayments} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={formatTooltipValue} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="received" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Money Received"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="paid" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Money Paid"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Top Selling Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topProducts.length > 0 ? (
                  <div className="space-y-4">
                    {topProducts.slice(0, 5).map((product, index) => (
                      <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{product._id}</p>
                            <p className="text-sm text-gray-500">
                              {product.totalQuantity} units sold
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatAmount(product.totalAmount)}</p>
                          <p className="text-sm text-gray-500">{product.count} orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No product data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Top Customers by Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topCustomers.length > 0 ? (
                  <div className="space-y-4">
                    {topCustomers.slice(0, 5).map((customer, index) => (
                      <div key={customer._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{customer._id}</p>
                            <p className="text-sm text-gray-500">
                              {customer.invoiceCount} invoices
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatAmount(customer.totalAmount)}</p>
                          <p className="text-sm text-gray-500">
                            Avg: {formatAmount(customer.avgOrderValue)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No customer data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sales Trend Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Sales Trend Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              {overview?.salesByDate && overview.salesByDate.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={formatSalesChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={formatTooltipValue} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3B82F6" 
                      fillOpacity={1} 
                      fill="url(#salesGradient)"
                      name="Sales Amount"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Number of Orders"
                      yAxisId="right"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No sales data available for the selected period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Insights;
