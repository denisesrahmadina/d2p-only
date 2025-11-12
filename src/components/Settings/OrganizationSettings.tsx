import React from 'react';
import { Building2, Shield, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { OrganizationService, IndustryService, type Industry } from '../../services';
import { type Organization } from '../../types/agent';

interface OrganizationSettingsProps {
  selectedOrganization: string | null;
}

const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({ selectedOrganization }) => {
  // Industry classification expanded state
  const [industryExpanded, setIndustryExpanded] = React.useState(false);
  
  // State for service data
  const [currentOrg, setCurrentOrg] = React.useState<Organization | null>(null);
  const [subsidiaries, setSubsidiaries] = React.useState<Organization[]>([]);
  const [industry, setIndustry] = React.useState<Industry | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Load data using services
  React.useEffect(() => {
    const loadData = async () => {
      if (!selectedOrganization) return;
      
      try {
        setLoading(true);
        
        // Load organization data
        const orgData = await OrganizationService.getOrganizationById(selectedOrganization);
        setCurrentOrg(orgData || null);
        
        // Load subsidiaries
        const subsidiariesData = await OrganizationService.getSubsidiariesByParent(selectedOrganization);
        setSubsidiaries(subsidiariesData);
        
        // Load industry data
        if (orgData?.industryId) {
          const industryData = await IndustryService.getIndustryById(orgData.industryId);
          setIndustry(industryData || null);
        }
        
      } catch (error) {
        console.error('Error loading organization settings data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedOrganization]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading organization settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentOrg) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
        <h3 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">Organization Not Found</h3>
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          Could not load organization data. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Organization Overview */}
      <div className="bg-gradient-to-r border border-gray-200 dark:border-gray-800 from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-md font-bold text-gray-900 dark:text-white mb-2">
              {currentOrg.name}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{currentOrg.type} Organization</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span>Enterprise Level</span>
              </div>
            </div>
            {industry && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setIndustryExpanded(!industryExpanded)}
                  className="w-full flex items-center justify-between mb-2 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md p-2 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Industry Classification</h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">
                      {industry.sector}
                    </span>
                  </div>
                  {industryExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
                
                {/* Always visible: Industry name and description */}
                <div className="mb-3">
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{industry.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{industry.description}</p>
                
                {/* Expandable content: Detailed information */}
                {industryExpanded && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Key Metrics</h4>
                      <div className="space-y-1">
                        {industry.keyMetrics.slice(0, 3).map((metric, index) => (
                          <div key={index} className="flex items-center space-x-1">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{metric}</span>
                          </div>
                        ))}
                        {industry.keyMetrics.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">+{industry.keyMetrics.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Regulatory Bodies</h4>
                      <div className="space-y-1">
                        {industry.regulatoryBodies.slice(0, 2).map((body, index) => (
                          <div key={index} className="flex items-center space-x-1">
                            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{body}</span>
                          </div>
                        ))}
                        {industry.regulatoryBodies.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">+{industry.regulatoryBodies.length - 2} more</span>
                        )}
                      </div>
                    </div>
                    </div>
                  
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Sustainability Focus</h4>
                    <div className="flex flex-wrap gap-1">
                      {industry.sustainabilityFocus.slice(0, 4).map((focus, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded">
                          {focus}
                        </span>
                      ))}
                      {industry.sustainabilityFocus.length > 4 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                          +{industry.sustainabilityFocus.length - 4}
                        </span>
                      )}
                    </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentOrg.kpis.map((kpi) => (
            <div key={kpi.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">{kpi.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  kpi.trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                  kpi.trend === 'down' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→'}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {kpi.value} {kpi.unit}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Target: {kpi.target} {kpi.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subsidiaries */}
      {subsidiaries.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Subsidiaries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subsidiaries.map((subsidiary) => (
              <div key={subsidiary.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{subsidiary.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Subsidiary</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {subsidiary.kpis.slice(0, 2).map((kpi) => (
                    <div key={kpi.id} className="text-center">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {kpi.value} {kpi.unit}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{kpi.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSettings;