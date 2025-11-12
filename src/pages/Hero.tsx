import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, TrendingUp, Shield, Zap, Users, BarChart3, ArrowRight, CheckCircle, Globe, Building2, Moon, Sun, Code, FileText, TestTube, Cog, Rocket, ClipboardList, DollarSign, UserCheck, Headphones, ShoppingCart, Calculator, PieChart, Clock, Target, Search, TrendingDown, Store, Receipt, Package } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SSCProcessVisualization from '../components/Procurements/SSCProcessVisualization';

const Hero: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const sscCapabilities = [
    {
      icon: Search,
      title: "Intelligent Sourcing",
      description: "AI-powered supplier discovery, RFQ automation, and smart vendor selection based on quality, price, and delivery performance."
    },
    {
      icon: TrendingUp,
      title: "Demand Forecasting",
      description: "Predictive analytics for demand planning using historical data, market trends, and seasonal patterns to optimize inventory."
    },
    {
      icon: Calculator,
      title: "Cost Estimation",
      description: "Real-time cost analysis, total cost of ownership calculations, and dynamic pricing recommendations for procurement decisions."
    },
    {
      icon: Store,
      title: "Marketplace Integration",
      description: "Unified procurement marketplace with automated catalog management, contract compliance, and multi-vendor price comparison."
    },
    {
      icon: ShoppingCart,
      title: "Purchase Processing",
      description: "Automated purchase requisition to PO conversion, approval workflows, and real-time order tracking with SAP integration."
    },
    {
      icon: Receipt,
      title: "Invoice Payment",
      description: "Intelligent invoice matching, automated payment processing, early payment discounts, and vendor reconciliation."
    }
  ];

  const benefits = [
    "Reduce procurement costs",
    "Improve forecast accuracy",
    "Accelerate purchase cycles ",
    "Eliminate manual data entry errors",
    "Enable real-time spend visibility",
    "Optimize working capital"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 animate-slide-in-left">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                <img src="/acnlogoonlywhite.png" alt="Logo" className="w-5 object-contain" />
              </div>
              <span className="text-base font-bold text-gray-900 dark:text-white">Accenture Intelligent Procurement Suite</span>
            </div>
            <div className="flex items-center space-x-3 animate-slide-in-right">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 hover:rotate-12"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Access Platform
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Visualization Overlay */}
      <section className="relative flex overflow-hidden bg-top bg-no-repeat" style={{ backgroundImage: 'url(/sscfunnelacn.png)' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-indigo-900/80 animate-fade-in">
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="relative z-10 text-center mb-16">
            <div className="mb-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <span className="inline-block px-4 py-2 bg-white/90 dark:bg-blue-900/80 border border-blue-200 dark:border-blue-700 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium mb-6 hover:scale-110 transition-transform duration-200">
                ⚡ Powered by Agentic AI & ERP Integration
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              E2E Procurement Suite
              <span className="block bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mt-2 animate-gradient-x">
                AI Automation
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              From sourcing to payment - intelligent procurement automation powered by AI.
              <span className="block mt-2 text-white font-semibold">Optimize sourcing, forecast demand, estimate costs, integrate marketplaces, and automate vendor payments.</span>
            </p>
          </div>

          {/* SSC Process Visualization - Overlapping */}
          <div className="relative z-20 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <SSCProcessVisualization />
          </div>
        </div>
      </section>

      {/* SSC Capabilities Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold mb-4 animate-fade-in-up hover:scale-110 transition-transform duration-200">
              AI CAPABILITIES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Complete Procurement Lifecycle Automation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              End-to-end procurement intelligence from sourcing to vendor payment with seamless ERP integration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sscCapabilities.map((capability, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-8 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-200 dark:border-gray-700 animate-fade-in-up group cursor-pointer" style={{animationDelay: `${0.1 + index * 0.1}s`}}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <capability.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{capability.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <div>
                <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm font-semibold mb-4 hover:scale-110 transition-transform duration-200">
                  PROCUREMENT TRANSFORMATION
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Intelligent Procurement
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Transform your procurement operations with AI that optimizes every step from strategic sourcing
                  to vendor payment, delivering cost savings and operational excellence.
                </p>
              </div>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4 animate-fade-in-up hover:translate-x-2 transition-transform duration-200" style={{animationDelay: `${index * 0.1}s`}}>
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 animate-bounce-subtle" style={{animationDelay: `${index * 0.2}s`}} />
                    <span className="text-gray-700 dark:text-gray-300 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 animate-gradient-x">
                <h3 className="text-3xl font-bold mb-8">Procurement Impact Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center group cursor-pointer animate-fade-in-up hover:scale-110 transition-transform duration-200" style={{animationDelay: '0.2s'}}>
                    <div className="text-4xl font-bold text-blue-200 mb-2 group-hover:scale-125 transition-transform duration-300">Realize</div>
                    <div className="text-blue-100 text-sm">Cost Savings</div>
                  </div>
                  <div className="text-center group cursor-pointer animate-fade-in-up hover:scale-110 transition-transform duration-200" style={{animationDelay: '0.3s'}}>
                    <div className="text-4xl font-bold text-purple-200 mb-2 group-hover:scale-125 transition-transform duration-300">90%+</div>
                    <div className="text-purple-100 text-sm">Forecast Accuracy</div>
                  </div>
                  <div className="text-center group cursor-pointer animate-fade-in-up hover:scale-110 transition-transform duration-200" style={{animationDelay: '0.4s'}}>
                    <div className="text-4xl font-bold text-indigo-200 mb-2 group-hover:scale-125 transition-transform duration-300">70%</div>
                    <div className="text-indigo-100 text-sm">Faster Cycles</div>
                  </div>
                  <div className="text-center group cursor-pointer animate-fade-in-up hover:scale-110 transition-transform duration-200" style={{animationDelay: '0.5s'}}>
                    <div className="text-4xl font-bold text-cyan-200 mb-2 group-hover:scale-125 transition-transform duration-300">100%</div>
                    <div className="text-cyan-100 text-sm">Visibility</div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl animate-pulse-slow"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-20 blur-xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 animate-fade-in-up">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-3 transition-all duration-200">
                  <img src="/acnlogoonlywhite.png" alt="Logo" className="w-6 object-contain" />
                </div>
                <span className="text-2xl font-bold">Intelligent Procurement Suite</span>
              </div>
              <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                Transforming procurement operations with end-to-end AI automation,
                from sourcing to payment with enterprise intelligence.
              </p>
              <div className="flex items-center space-x-2 hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Accenture AI - Procurement Excellence</span>
              </div>
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <h3 className="font-bold mb-4 text-lg">Procurement Suite</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer">Intelligent Sourcing</li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer">Demand Forecasting</li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer">Cost Estimation</li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer">Marketplace Integration</li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer">Invoice Payment</li>
              </ul>
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h3 className="font-bold mb-4 text-lg">Support & Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer">Implementation Guide</li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer">Best Practices</li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer">24/7 Support</li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer">Training Programs</li>
                <li className="hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer">ROI Calculator</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <p className="text-lg">&copy; 2025 Accenture AI - Intelligent Procurement Suite. All rights reserved.</p>
            <p className="text-sm mt-2">Enterprise AI Solutions | Global Procurement Expertise</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;