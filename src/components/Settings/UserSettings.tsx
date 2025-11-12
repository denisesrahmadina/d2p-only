import React from 'react';
import { Users, Search, Filter, ChevronDown, ChevronUp, Crown, Briefcase, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserService, type User as userData } from '../../services';
import { type Organization } from '../../types/agent';

interface UserSettingsProps {
  selectedOrganization: string | null;
  currentOrg: Organization | null;
}

const UserSettings: React.FC<UserSettingsProps> = ({ selectedOrganization, currentOrg }) => {
  const { user } = useAuth();
  
  // User table state
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('');
  const [sortField, setSortField] = React.useState<keyof userData>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  
  // State for user data
  const [users, setUsers] = React.useState<userData[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Load users data
  React.useEffect(() => {
    const loadUsers = async () => {
      if (!selectedOrganization) return;
      
      try {
        setLoading(true);
        const usersData = await UserService.getUsersByOrganization(selectedOrganization);
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users data:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [selectedOrganization]);
  
  // Filter users by current organization
  const organizationUsers = users;

  // Get unique roles and departments for filters
  const uniqueRoles = [...new Set(organizationUsers.map(u => u.role))];
  const uniqueDepartments = [...new Set(organizationUsers.map(u => u.department))];

  // Filter and sort users
  const filteredAndSortedUsers = React.useMemo(() => {
    let filtered = organizationUsers;

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm) ||
        user.role.toLowerCase().includes(lowerSearchTerm) ||
        user.department.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply department filter
    if (departmentFilter) {
      filtered = filtered.filter(user => user.department === departmentFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [organizationUsers, searchTerm, roleFilter, departmentFilter, sortField, sortDirection]);

  const handleSort = (field: keyof userData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getRoleIcon = (role: string) => {
    if (role.toLowerCase().includes('chief') || role.toLowerCase().includes('ceo')) {
      return Crown;
    }
    if (role.toLowerCase().includes('director') || role.toLowerCase().includes('vp')) {
      return Briefcase;
    }
    return UserIcon;
  };

  const getRoleColor = (role: string) => {
    if (role.toLowerCase().includes('chief') || role.toLowerCase().includes('ceo')) {
      return 'text-purple-600 bg-purple-100 dark:bg-purple-900/50';
    }
    if (role.toLowerCase().includes('director') || role.toLowerCase().includes('vp')) {
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/50';
    }
    return 'text-gray-600 bg-gray-100 dark:bg-gray-700/50';
  };

  const getPermissionColor = (permission: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
      'all-agents': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      'strategic-planning': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      'performance-monitoring': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      'compliance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
      'investment-analysis': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
      'esg-tracking': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      'risk-management': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
    };
    return colors[permission] || 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading user settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Users Overview */}
      <div className="border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
        <div className="flex ">
           <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="ml-4 text-md font-bold text-gray-900 dark:text-white">
              Organization Users
            </h2>
            <p className="ml-4 text-sm text-gray-600 dark:text-gray-400">
              {filteredAndSortedUsers.length} of {organizationUsers.length} users with access to {currentOrg?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Search & Filter Users</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, role..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        {(searchTerm || roleFilter || departmentFilter) && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedUsers.length} of {organizationUsers.length} users
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
                setDepartmentFilter('');
              }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Organization Users</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">({filteredAndSortedUsers.length} users)</span>
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    {sortField === 'email' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Role</span>
                    {sortField === 'role' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Department</span>
                    {sortField === 'department' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Permissions
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('lastLogin')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Login</span>
                    {sortField === 'lastLogin' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedUsers.map((orgUser) => {
                const RoleIcon = getRoleIcon(orgUser.role);
                const isCurrentUser = orgUser.id === user?.id;
                
                return (
                  <tr key={orgUser.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRoleColor(orgUser.role)}`}>
                          <RoleIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{orgUser.name}</div>
                            {isCurrentUser && (
                              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{orgUser.email}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(orgUser.role)}`}>
                        {orgUser.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{orgUser.department}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {orgUser.permissions.slice(0, 2).map((permission) => (
                          <span
                            key={permission}
                            className={`px-2 py-1 rounded text-xs font-medium ${getPermissionColor(permission)}`}
                          >
                            {permission.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        ))}
                        {orgUser.permissions.length > 2 && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                            +{orgUser.permissions.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{orgUser.lastLogin}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAndSortedUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {organizationUsers.length === 0 ? 'No users found for this organization' : 'No users match your current filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettings;