import React, { useState } from 'react';
import { ArrowLeft, Building2, Users, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrganization } from '../contexts/OrganizationContext';
import { OrganizationService } from '../services';
import { type Organization, type KPI } from '../types/agent';
import OrganizationSettings from '../components/Settings/OrganizationSettings';
import UserSettings from '../components/Settings/UserSettings';
import DepartmentSettings from '../components/Settings/DepartmentSettings';

const Settings: React.FC = () => {
  const { user, selectedOrganization } = useAuth();
  const { getCurrentOrganization } = useOrganization();
  const [activeTab, setActiveTab] = useState<'organization' | 'departments' | 'users'>('organization');
  
  // State for service data
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data using services
  React.useEffect(() => {
    const loadData = async () => {
      if (!selectedOrganization) return;
      
      try {
        setLoading(true);
        
        // Load organization data
        const orgData = await OrganizationService.getOrganizationById(selectedOrganization);
        setCurrentOrg(orgData || null);
        
      } catch (error) {
        console.error('Error loading settings data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedOrganization]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Settings
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Loading organization settings...
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading settings data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard" 
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your organization and user settings
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-6 px-4">
            <button
              onClick={() => setActiveTab('organization')}
              className={`flex items-center space-x-2 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'organization'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Organization</span>
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`flex items-center space-x-2 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'departments'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Departments</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-2 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Users</span>
            </button>
          </nav>
        </div>

        <div>
          {/* Organization Tab */}
          {activeTab === 'organization' && (
            <OrganizationSettings selectedOrganization={selectedOrganization} />
          )}

          {/* Departments Tab */}
          {activeTab === 'departments' && (
            <DepartmentSettings selectedOrganization={selectedOrganization} />
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <UserSettings 
              selectedOrganization={selectedOrganization} 
              currentOrg={currentOrg}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;