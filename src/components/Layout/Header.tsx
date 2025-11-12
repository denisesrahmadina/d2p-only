import React from 'react';
import { Menu, Moon, Sun, User, LogOut, Settings, ChevronDown, Kanban, Bot, Book, ShoppingBag, MapPin, HeadphonesIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { OrganizationService } from '../../services/organizationService';
import { IndustryService } from '../../services/industryService';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout, selectedOrganization } = useAuth();
  const { getCurrentOrganization } = useOrganization();
  const navigate = useNavigate();
  const location = useLocation();
  const currentOrg = getCurrentOrganization();
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [orgInfoExpanded, setOrgInfoExpanded] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [currentOrgData, setCurrentOrgData] = React.useState<any>(null);
  const [currentIndustry, setCurrentIndustry] = React.useState<any>(null);

  // Load current organization and industry data from database
  React.useEffect(() => {
    const loadOrgAndIndustry = async () => {
      if (selectedOrganization) {
        const org = await OrganizationService.getOrganizationByOrgId(selectedOrganization);
        setCurrentOrgData(org);

        if (org?.industryId) {
          const industry = await IndustryService.getIndustryById(org.industryId);
          setCurrentIndustry(industry);
        }
      }
    };
    loadOrgAndIndustry();
  }, [selectedOrganization]);

  const handleThemeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleTheme();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
      if (!target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center space-x-3">
          {/* Mobile Burger Menu */}
          <div className="relative mobile-menu-container md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Kanban className="h-4 w-4" />
                  <span>Control Tower</span>
                </Link>

                <Link
                  to="/agents"
                  className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                    location.pathname === '/agents'
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bot className="h-4 w-4" />
                  <span>AI Agents</span>
                </Link>

                <Link
                  to="/map"
                  className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                    location.pathname === '/map'
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MapPin className="h-4 w-4" />
                  <span>Unit Locations</span>
                </Link>

                <Link
                  to="/support"
                  className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                    location.pathname === '/support'
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HeadphonesIcon className="h-4 w-4" />
                  <span>Support</span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <img src="/acnlogoonlywhite.png" alt="Logo" className="w-5 object-contain" />
            </div>
            <div>
              <h1 className="text-sm sm:text-md font-bold text-gray-900 dark:text-white">
                Accenture Intelligent Procurement Suite
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden lg:block">
                Transform Enterprise Procurement with AI automation
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Desktop Only */}
        <div className="flex items-center">
          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              to="/dashboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                location.pathname === '/dashboard' 
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Kanban className="h-4 w-4" />
              <span>Control Tower</span>
            </Link>
            
            <Link
              to="/agents"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                location.pathname === '/agents'
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Bot className="h-4 w-4" />
              <span>AI Agents</span>
            </Link>

            <Link 
              to="/procurements"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                location.pathname === '/procurements' 
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Procurement Processes</span>
            </Link>
          </nav>
        </div>

        {/* Organization & Industry Info - Desktop Only */}
        <div className="hidden lg:flex items-center space-x-4">
          {currentIndustry && currentOrgData && (
            <div className="relative">
              <button
                onClick={() => setOrgInfoExpanded(!orgInfoExpanded)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentOrgData.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {currentIndustry.name}
                  </div>
                </div>

                {selectedOrganization === 'indonesia-power' && (
                  <img
                    src={isDarkMode ? "/indonesia-power-dark.png" : "/indonesia-power.png"}
                    alt="Indonesia Power"
                    className="h-6 object-contain"
                  />
                )}
                
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${orgInfoExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown with KPIs */}
              {orgInfoExpanded && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{currentOrgData.name}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">
                        {currentOrgData.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{currentIndustry.description}</p>
                  </div>
                  
                  <div className="px-4 py-3">
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Performance Indicators</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {currentOrgData.kpis.slice(0, 4).map(kpi => (
                        <div key={kpi.id} className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {kpi.value} {kpi.unit}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{kpi.name}</div>
                          <div className="flex items-center justify-center space-x-1 mt-1">
                            <span className={`text-xs ${
                              kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                              kpi.trend === 'down' ? 'text-red-600 dark:text-red-400' : 
                              'text-gray-600 dark:text-gray-400'
                            }`}>
                              {kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Target: {kpi.target}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {/* Profile Menu */}
          <div className="relative profile-menu-container">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform hidden lg:block ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user?.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.department}</p>
                </div>
                
                <button
                  onClick={(e) => {
                    handleThemeToggle(e);
                    setProfileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                
                <Link
                  to="/settings"
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
                
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
           
                </button>
              </div>
            )
            }
           
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;