import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Building2, User, Lock, ArrowLeft, CheckCircle, Users, ChevronRight, ChevronDown, Code, FileText, TestTube, UserCheck, Headphones, DollarSign, ShoppingCart, PieChart, Shield, TrendingUp, Target, Database, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { OrganizationService } from '../services/organizationService';
import { UserService } from '../services/userService';

interface LoginUser {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  lastLogin: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMode, setLoginMode] = useState<'manual' | 'userSelect'>('userSelect');
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [holdingOrganizations, setHoldingOrganizations] = useState<any[]>([]);
  const [organizationsLoading, setOrganizationsLoading] = useState(true);
  const [users, setUsers] = useState<LoginUser[]>([]);
  const [sscUsers, setSscUsers] = useState<LoginUser[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setOrganizationsLoading(true);
      const orgs = await OrganizationService.getHoldingCompanies();
      setHoldingOrganizations(orgs);

      const allUsers = await UserService.getUsers();
      console.log('All users loaded:', allUsers);
      setUsers(allUsers);

      const ipUsers = allUsers.filter(user => user.organizationId === 'indonesia-power');
      console.log('Indonesia Power users:', ipUsers);
      setSscUsers(ipUsers);

      setOrganizationsLoading(false);
    };
    loadData();
  }, []);

  const handleUserSelect = (user: LoginUser) => {
    setSelectedOrganization(user.organizationId);
    setEmail(user.email);
    setPassword('demo123');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password.');
        setLoading(false);
        return;
      }

      if (!selectedOrganization) {
        setError('Please select an organization.');
        setLoading(false);
        return;
      }

      console.log('🔐 [LOGIN] Attempting authentication for:', email);

      // Find the user in our users list
      const user = users.find(u => u.email === email && u.organizationId === selectedOrganization);

      if (!user) {
        setError('Invalid email or organization. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Validate password (in a real app, this would be done server-side)
      if (password !== 'demo123') {
        setError('Invalid password. Please try again.');
        setLoading(false);
        return;
      }

      console.log('✅ [LOGIN] Authentication successful, logging in user...');

      // Call the login function from AuthContext
      authLogin(user, selectedOrganization);

      console.log('✅ [LOGIN] Redirecting to dashboard...');
      navigate('/procurements/demand-to-plan');
    } catch (err: any) {
      console.error('❌ [LOGIN] Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getOrganizationColor = (orgId: string) => {
    switch (orgId) {
      case 'pertamina-holding': return 'from-blue-600 to-purple-600';
      case 'barito-pacific': return 'from-green-600 to-teal-600';
      case 'tiaramarga': return 'from-orange-600 to-red-600';
      case 'aib-bank': return 'from-indigo-600 to-blue-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getRoleIcon = (role: string) => {
    if (role.toLowerCase().includes('chief') || role.toLowerCase().includes('ceo')) {
      return '👑';
    }
    if (role.toLowerCase().includes('director') || role.toLowerCase().includes('vp') || role.toLowerCase().includes('head')) {
      return '💼';
    }
    return '👤';
  };

  const getRoleColor = (role: string) => {
    if (role.toLowerCase().includes('chief') || role.toLowerCase().includes('ceo')) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
    }
    if (role.toLowerCase().includes('director') || role.toLowerCase().includes('vp') || role.toLowerCase().includes('head')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
  };

  const toggleUserExpansion = (userId: string) => {
    setExpandedUsers(prev => {
      const newSet = new Set<string>();
      if (!prev.has(userId)) {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors duration-200">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4 animate-slide-down">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-bounce-subtle">
              <img src="/acnlogoonlywhite.png" alt="Logo" className="w-6 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accenture Intelligent Procurement Suite</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 animate-fade-in-delay">Access intelligent procurement automation powered by AI</p>

          {/* Procurement Capabilities Banner */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 animate-fade-in-delay-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 animate-slide-in-left hover:scale-105 transition-transform duration-200" style={{animationDelay: '0.1s'}}>
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-800 dark:text-blue-200">Smart Sourcing</span>
              </div>
              <div className="flex items-center space-x-2 animate-slide-in-left hover:scale-105 transition-transform duration-200" style={{animationDelay: '0.2s'}}>
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-green-800 dark:text-green-200">Demand Forecast</span>
              </div>
              <div className="flex items-center space-x-2 animate-slide-in-left hover:scale-105 transition-transform duration-200" style={{animationDelay: '0.3s'}}>
                <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-800 dark:text-purple-200">Cost Analysis</span>
              </div>
              <div className="flex items-center space-x-2 animate-slide-in-left hover:scale-105 transition-transform duration-200" style={{animationDelay: '0.4s'}}>
                <ShoppingCart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-orange-800 dark:text-orange-200">Marketplace Integration</span>
              </div>
              <div className="flex items-center space-x-2 animate-slide-in-left hover:scale-105 transition-transform duration-200" style={{animationDelay: '0.5s'}}>
                <Database className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-indigo-800 dark:text-indigo-200">PO Processing</span>
              </div>
              <div className="flex items-center space-x-2 animate-slide-in-left hover:scale-105 transition-transform duration-200" style={{animationDelay: '0.6s'}}>
                <Zap className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200">Auto Payments</span>
              </div>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Selection Panel */}
          {loginMode === 'userSelect' && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col h-[500px] animate-slide-in-left">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Procurement Team Access</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select your role to access procurement automation platform
                <span className="ml-2 text-xs">({sscUsers.length} users available)</span>
              </p>

              {organizationsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Loading users...</p>
                </div>
              ) : sscUsers.length === 0 ? (
                <div className="text-center py-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium">No users found for Indonesia Power</p>
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-2">Total users loaded: {users.length}</p>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto pr-2 flex-1">
                  {sscUsers.map((user, index) => (
                  <div key={user.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden animate-fade-in-up" style={{animationDelay: `${index * 0.05}s`}}>
                    {/* Collapsed Header - Always Visible */}
                    <div
                      className="w-full text-left p-3 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group cursor-pointer hover:shadow-md"
                      onClick={() => toggleUserExpansion(user.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                            {user.name}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {expandedUsers.has(user.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content - Show when expanded */}
                    {expandedUsers.has(user.id) && (
                      <div className="px-3 pb-3 bg-gray-50 dark:bg-gray-800/50 animate-slide-down">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400 text-xs">Email:</span>
                            <div className="text-gray-900 dark:text-white text-xs">{user.email}</div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400 text-xs">Organization:</span>
                            <div className="text-gray-900 dark:text-white text-xs font-medium">
                              {holdingOrganizations.find(org => org.id === user.organizationId)?.name || user.organizationId}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400 text-xs">Department:</span>
                            <div className="text-gray-900 dark:text-white text-xs">{user.department}</div>
                          </div>
                          <div className="pt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUserSelect(user);
                              }}
                              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                            >
                              Select This User
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 h-[500px] flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {loginMode === 'userSelect' ? 'Procurement Platform Login' : 'Procurement Login'}
              </h2>
              {loginMode === 'userSelect' && (email || selectedOrganization) && (
                <CheckCircle className="h-5 w-5 text-green-500 animate-bounce-subtle" />
              )}
            </div>


            <form onSubmit={handleLogin} className="space-y-6">
              {/* Organization Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedOrganization}
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                    required
                    disabled={organizationsLoading}
                  >
                    <option value="">{organizationsLoading ? 'Loading organizations...' : 'Select your organization'}</option>
                    {holdingOrganizations.map(org => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                    placeholder="Enter your email"
                    required
                    disabled={loginMode === 'userSelect' && !!email}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                    placeholder="Enter your password"
                    required
                    disabled={loginMode === 'userSelect' && !!password}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 animate-shake">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || !selectedOrganization || !email || !password}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-sm hover:shadow-lg hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {loginMode === 'userSelect' && !email && sscUsers.length > 0 && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 animate-pulse-slow">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  👈 Click on any team member from the left panel to automatically populate login credentials
                </p>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};

export default Login;