import React, { useState } from 'react';
import { Users, Search, Filter, ChevronDown, ChevronUp, Building2, User, Crown, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DepartmentsService, type Department } from '../../services';

interface DepartmentSettingsProps {
  selectedOrganization: string | null;
}

const DepartmentSettings: React.FC<DepartmentSettingsProps> = ({ selectedOrganization }) => {
  const { user } = useAuth();
  
  // Department table state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Department>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // State for department data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentStats, setDepartmentStats] = useState<any>(null);

  // Load departments data
  React.useEffect(() => {
    const loadDepartments = async () => {
      if (!selectedOrganization) return;
      
      try {
        setLoading(true);
        const departmentsData = await DepartmentsService.getDepartmentsByOrganization(selectedOrganization);
        setDepartments(departmentsData);
        
        const stats = await DepartmentsService.getDepartmentStatistics(selectedOrganization);
        setDepartmentStats(stats);
      } catch (error) {
        console.error('Error loading departments data:', error);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, [selectedOrganization]);

  // Filter and sort departments
  const filteredAndSortedDepartments = React.useMemo(() => {
    let filtered = departments;

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(dept =>
        dept.name.toLowerCase().includes(lowerSearchTerm) ||
        dept.description.toLowerCase().includes(lowerSearchTerm) ||
        dept.head.toLowerCase().includes(lowerSearchTerm)
      );
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
  }, [departments, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof Department) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getDepartmentIcon = (icon: string) => {
    return icon || '🏢';
  };

  const getEmployeeCountColor = (employees: number) => {
    if (employees >= 40) return 'text-green-600 bg-green-100 dark:bg-green-900/50';
    if (employees >= 25) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/50';
    if (employees >= 15) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-700/50';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading department settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Departments Overview */}
      {departmentStats && (
        <div className="border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-md font-bold text-gray-900 dark:text-white mb-2">
                Organization Departments
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-purple-800 dark:text-purple-200 font-medium">Total Departments:</span>
                  <span className="ml-2 text-purple-900 dark:text-purple-100 font-bold">{departmentStats.totalDepartments}</span>
                </div>
                <div>
                  <span className="text-purple-800 dark:text-purple-200 font-medium">Total Employees:</span>
                  <span className="ml-2 text-purple-900 dark:text-purple-100 font-bold">{departmentStats.totalEmployees}</span>
                </div>
                <div>
                  <span className="text-purple-800 dark:text-purple-200 font-medium">Avg per Department:</span>
                  <span className="ml-2 text-purple-900 dark:text-purple-100 font-bold">{departmentStats.averageEmployeesPerDepartment}</span>
                </div>
                <div>
                  <span className="text-purple-800 dark:text-purple-200 font-medium">Largest Department:</span>
                  <span className="ml-2 text-purple-900 dark:text-purple-100 font-bold">
                    {departmentStats.largestDepartment?.name || 'N/A'} ({departmentStats.largestDepartment?.employees || 0})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Controls */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Search Departments</span>
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Departments
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, description, or head..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        {searchTerm && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedDepartments.length} of {departments.length} departments
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Departments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Organization Departments</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">({filteredAndSortedDepartments.length} departments)</span>
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
                    <span>Department</span>
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('head')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Department Head</span>
                    {sortField === 'head' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('employees')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Employees</span>
                    {sortField === 'employees' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedDepartments.map((department) => (
                <tr key={department.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center text-lg">
                        {getDepartmentIcon(department.icon)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{department.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">ID: {department.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-md">
                    <div className="line-clamp-2" title={department.description}>
                      {department.description}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{department.head}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${getEmployeeCountColor(department.employees)}`}>
                      <Users className="h-3 w-3" />
                      <span className="text-sm font-medium">{department.employees}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedDepartments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {departments.length === 0 ? 'No departments found for this organization' : 'No departments match your search criteria'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentSettings;