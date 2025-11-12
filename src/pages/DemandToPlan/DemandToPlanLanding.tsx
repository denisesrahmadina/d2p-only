import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Package, ArrowRight, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const DemandToPlanLanding: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const ModuleTile = ({
    title,
    description,
    icon: Icon,
    path,
    gradient,
    iconColor,
  }: {
    title: string;
    description: string;
    icon: React.ElementType;
    path: string;
    gradient: string;
    iconColor: string;
  }) => {
    const isExternalUrl = path.startsWith('http://') || path.startsWith('https://');
    
    const handleClick = () => {
      if (isExternalUrl) {
        window.open(path, '_blank', 'noopener,noreferrer');
      } else {
        navigate(path);
      }
    };

    return (
      <button
        onClick={handleClick}
        className="group relative bg-white dark:bg-accenture-gray-dark rounded-2xl shadow-lg border border-gray-200 dark:border-accenture-gray-medium p-10 hover:shadow-2xl transition-all duration-300 text-left w-full overflow-hidden"
      >
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 dark:opacity-10 transform translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-full h-full" />
      </div>

      <div className="relative z-10">
        <div className={`${gradient} rounded-xl p-5 mb-6 inline-block group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <Icon className={`h-12 w-12 ${iconColor}`} />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-accenture-purple transition-colors duration-300">
          {title}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex items-center text-accenture-purple dark:text-accenture-purple-light font-semibold group-hover:translate-x-2 transition-transform duration-300">
          <span>Access Module</span>
          <ArrowRight className="h-5 w-5 ml-2" />
        </div>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-accenture-purple dark:group-hover:border-accenture-purple-light rounded-2xl transition-colors duration-300"></div>
    </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-accenture-gray-light dark:from-gray-900 dark:via-accenture-gray-dark dark:to-black transition-colors duration-300">
      <header className="relative bg-white dark:bg-accenture-black border-b border-gray-200 dark:border-accenture-gray-medium shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-accenture-purple/5 via-accenture-azure/5 to-transparent dark:from-accenture-purple/10 dark:via-accenture-azure/10"></div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accenture-purple to-accenture-azure rounded-lg flex items-center justify-center shadow-lg">
                <img src="/acnlogoonlywhite.png" alt="Accenture" className="w-6 object-contain" />
              </div>
              <div>
                <div className="text-xs font-semibold text-accenture-purple dark:text-accenture-purple-light uppercase tracking-wide">
                  Accenture Intelligent Procurement
                </div>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-gray-100 dark:bg-accenture-gray-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-accenture-gray-dark transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mb-4 flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accenture-purple dark:hover:text-accenture-purple-light transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-accenture-gray-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Procurement Process</span>
            </button>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-accenture-purple via-accenture-azure to-accenture-purple-dark bg-clip-text text-transparent mb-3">
              Demand to Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
              Comprehensive procurement planning and inventory management system designed for enterprise-level operations
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="mb-12 text-center">
          <div className="inline-block px-4 py-2 bg-accenture-purple/10 dark:bg-accenture-purple/20 border border-accenture-purple/20 dark:border-accenture-purple/30 rounded-full mb-6">
            <span className="text-accenture-purple dark:text-accenture-purple-light font-semibold text-sm uppercase tracking-wide">
              Select Your Module
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Choose a planning module to get started
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Access powerful tools for procurement forecasting and centralized inventory management
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <ModuleTile
            title="DPK"
            description="Daftar Permintaan Kebutuhan - Manage procurement requests with annual and monthly forecasting capabilities, demand tracking, and comprehensive planning tools"
            icon={FileText}
            gradient="bg-gradient-to-br from-accenture-purple to-accenture-purple-dark"
            iconColor="text-white"
            path="/procurements/demand-to-plan/dpk/flow"
          />

          <ModuleTile
            title="CI"
            description="Centralized Inventory - Optimize inventory planning with rolling forecasts, automated alert management, and execution management tools for streamlined operations"
            icon={Package}
            gradient="bg-gradient-to-br from-accenture-azure to-accenture-azure-dark"
            iconColor="text-white"
            path="https://inventory-control-to-2qb7.bolt.host/"
          />
        </div>

        <div className="bg-gradient-to-r from-accenture-purple/5 via-accenture-azure/5 to-accenture-purple/5 dark:from-accenture-purple/10 dark:via-accenture-azure/10 dark:to-accenture-purple/10 rounded-2xl p-8 border border-accenture-purple/10 dark:border-accenture-purple/20 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Module Features Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-accenture-purple mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">DPK Dashboard</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Comprehensive overview with key procurement metrics and insights
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-accenture-purple mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Annual Forecast Planning</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Strategic planning tools for long-term procurement forecasting
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-accenture-purple mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Monthly Rolling Forecast</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Dynamic updates and adjustments for short-term demand planning
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-accenture-azure mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Inventory Overview</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Real-time visibility into centralized inventory levels and status
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-accenture-azure mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Automated Alerts</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Proactive notifications for inventory thresholds and exceptions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-accenture-azure mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Execution Management</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Tools for managing and tracking inventory execution workflows
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-accenture-gray-medium bg-white dark:bg-accenture-black mt-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="mb-2 md:mb-0">
              <span className="font-semibold text-accenture-purple dark:text-accenture-purple-light">
                Accenture
              </span>
              {' '}Intelligent Procurement Suite
            </div>
            <div>
              &copy; 2025 Accenture. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DemandToPlanLanding;
