import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Database, DollarSign, TrendingUp, FileCheck, ShoppingBag, Receipt, Headphones, BarChart3, ArrowRight, Sparkles, Zap } from 'lucide-react';

// Add keyframe animations
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
    50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
  }
`;
document.head.appendChild(style);

const ProcurementProcesses: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sscProcesses = [
    {
      id: 'demand-to-plan',
      label: 'Demand to Plan',
      path: '/procurements/demand-to-plan',
      icon: TrendingUp,
      description: 'Plan based on demand forecasts',
      gradient: 'from-purple-500 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'source-to-contract',
      label: 'Source to Contract',
      path: '/procurements/source-to-contract',
      icon: FileCheck,
      description: 'Manage sourcing and contracts',
      gradient: 'from-purple-600 to-purple-800',
      bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      iconColor: 'text-purple-700 dark:text-purple-400'
    },
    {
      id: 'procure-to-invoice',
      label: 'Procure to Invoice',
      path: '/procurements/procure-to-invoice',
      icon: ShoppingBag,
      description: 'Process procurement to invoice',
      gradient: 'from-purple-500 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      iconColor: 'text-purple-700 dark:text-purple-400'
    },
    {
      id: 'receipt-to-pay',
      label: 'Receipt to Pay',
      path: '/procurements/receipt-to-pay',
      icon: Receipt,
      description: 'Handle receipts and payments',
      gradient: 'from-purple-600 to-purple-800',
      bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      iconColor: 'text-purple-700 dark:text-purple-400'
    },
    {
      id: 'vendor-management',
      label: 'Vendor Management System',
      path: 'https://achmadfw93-vendor-ma-otx3.bolt.host/',
      icon: Headphones,
      description: 'Manage vendor relationships',
      gradient: 'from-purple-500 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'reporting',
      label: 'Reporting',
      path: '/procurements/reporting',
      icon: BarChart3,
      description: 'Generate procurement reports',
      gradient: 'from-purple-600 to-purple-800',
      bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div
        className={`relative overflow-hidden rounded-2xl p-8 shadow-2xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ background: 'linear-gradient(135deg, #a100ff 0%, #5b21b6 50%, #000000 100%)' }}
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg" style={{ animation: 'float 3s ease-in-out infinite' }}>
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">Intelligent Procurement</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 flex items-center space-x-3">
                <span>Procurement Processes</span>
                <Zap className="h-7 w-7 text-white animate-pulse" />
              </h1>
              <p className="text-base text-white/90 max-w-2xl leading-relaxed">
                Access end-to-end procurement workflows powered by advanced AI technology
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 shadow-lg">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-lg shadow-white/50"></div>
                <span className="text-white text-sm font-semibold">8 Active Processes</span>
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Decorative elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl" style={{ background: 'rgba(161, 0, 255, 0.3)', animation: 'float 6s ease-in-out infinite' }}></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full blur-3xl" style={{ background: 'rgba(91, 33, 182, 0.3)', animation: 'float 5s ease-in-out infinite reverse' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Process Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sscProcesses.map((process, index) => {
          const IconComponent = process.icon;
          const isHovered = hoveredCard === process.id;
          
          return (
            <Link
              key={process.id}
              to={process.path}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredCard(process.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative flex flex-col p-6 rounded-2xl border-2 bg-gradient-to-br ${process.bgGradient} hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden border-gray-200 dark:border-gray-700 hover:border-transparent ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ 
                animationDelay: `${index * 50}ms`,
                transitionDelay: `${index * 30}ms`
              }}
            >
              {/* Animated gradient border on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${process.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{ padding: '2px', zIndex: -1 }}>
                <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${process.bgGradient}`}></div>
              </div>
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${process.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
              
              {/* Shimmer effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} style={{ backgroundSize: '200% 100%', animation: isHovered ? 'shimmer 2s infinite' : 'none' }}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon container with enhanced animation */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${process.gradient} flex items-center justify-center mb-4 shadow-lg transition-all duration-500 ${isHovered ? 'scale-110 rotate-3' : ''}`}>
                  <IconComponent className="h-8 w-8 text-white transition-all duration-500" />
                </div>
                
                {/* Title */}
                <h3 className={`text-base font-bold text-gray-900 dark:text-white mb-2 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                  {process.label}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {process.description}
                </p>
                
                {/* Enhanced arrow indicator */}
                <div className={`flex items-center space-x-2 ${process.iconColor} transition-all duration-300`}>
                  <span className="text-sm font-semibold">Launch Process</span>
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${process.gradient} flex items-center justify-center transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`}>
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Corner accent */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${process.gradient} opacity-10 blur-2xl rounded-full transform translate-x-10 -translate-y-10 group-hover:translate-x-5 group-hover:-translate-y-5 transition-transform duration-500`}></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProcurementProcesses;
