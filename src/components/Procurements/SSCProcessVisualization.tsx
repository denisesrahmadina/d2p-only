import React from 'react';
import { Search, Store, Receipt, Calculator, Shield, ArrowRight, Zap, Clock, Target, TrendingUp, Building2, BarChart3, CheckCircle, Package, DollarSign } from 'lucide-react';

const SSCProcessVisualization: React.FC = () => {
  const sscAgents = [
    {
      id: 'sourcing',
      name: 'Sourcing AI Agent',
      icon: Search,
      color:'from-blue-600 to-blue-500',
      position: { x: 90, y: 80 },
      tasks: ['Supplier Discovery', 'RFQ Automation', 'Vendor Selection'],
      metrics: { processed: '3,247', accuracy: '98.9%', time: '1.8min' },
      model: 'gpt-4.1-mini'
    },
    {
      id: 'forecasting',
      name: 'Forecasting AI Agent',
      icon: TrendingUp,
      color: 'from-blue-600 to-blue-500',
      position: { x: 300, y: 50 },
      tasks: ['Demand Planning', 'Trend Analysis', 'Inventory Optimization'],
      metrics: { processed: '2,156', accuracy: '95.3%', time: '2.2min' },
      model: 'gemini-2.0-flash'
    },
    {
      id: 'cost-estimation',
      name: 'Cost Estimation AI Agent',
      icon: Calculator,
      color: 'from-blue-500 to-blue-600',
      position: { x: 550, y: 35 },
      tasks: ['Price Analysis', 'TCO Calculation', 'Cost Optimization'],
      metrics: { processed: '1,892', accuracy: '97.5%', time: '1.5min' },
      model: 'claude-4.1-opus'
    },
    {
      id: 'marketplace',
      name: 'Marketplace AI Agent',
      icon: Store,
      color: 'from-blue-500 to-blue-600',
      position: { x: 780, y: 50 },
      tasks: ['Catalog Management', 'Price Comparison', 'Vendor Matching'],
      metrics: { processed: '4,532', accuracy: '99.1%', time: '0.9min' },
      model: 'gemini-pro-1.5'
    },
    {
      id: 'po-processing',
      name: 'PO Processing AI Agent',
      icon: Package,
      color: 'from-blue-600 to-blue-500',
      position: { x: 400, y: 230 },
      tasks: ['PO Generation', 'Approval Routing', 'Order Tracking'],
      metrics: { processed: '2,743', accuracy: '99.6%', time: '1.2min' },
      model: 'gpt-4.1-mini'
    },
    {
      id: 'payment',
      name: 'Payment AI Agent',
      icon: Receipt,
      color:'from-blue-500 to-blue-600',
      position: { x: 650, y: 200 },
      tasks: ['Invoice Matching', 'Payment Processing', 'Reconciliation'],
      metrics: { processed: '3,187', accuracy: '99.8%', time: '1.7min' },
      model: 'claude-4.1-opus'
    }
  ];

  const [activeAgent, setActiveAgent] = React.useState<string | null>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Browser Window Frame */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Browser Header */}
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white dark:bg-gray-600 rounded-md px-3 py-1 text-sm text-gray-600 dark:text-gray-300">
                Procurement AI Agents - E2E Automation
              </div>
            </div>
          </div>
        </div>

        {/* SSC Dashboard Content */}
        <div className="bg-transparent p-8 min-h-[500px] relative">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white">
              Procurement AI Agent Ecosystem
            </h3>
            <p className="mb-10 text-white/90">Intelligent agents for sourcing, forecasting, cost analysis, marketplace, PO processing, and payment</p>
          </div>

          {/* Process Flow Visualization */}
          <div className="relative h-80">
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
              
              {/* Central hub connections */}
              {sscAgents.slice(0, 4).map((agent, index) => (
                <line
                  key={`line-${agent.id}`}
                  x1="50%"
                  y1="50%"
                  x2={`${agent.position.x / 10}%`}
                  y2={`${agent.position.y / 3}%`}
                  stroke="url(#flowGradient)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                  style={{
                    animation: 'dash 2s linear infinite'
                  }}
                />
              ))}
              
              {/* Analytics and Compliance connections */}
              <line
                x1="50%"
                y1="50%"
                x2="40%"
                y2="67%"
                stroke="url(#flowGradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse"
                style={{
                  animation: 'dash 2s linear infinite'
                }}
              />
              <line
                x1="50%"
                y1="50%"
                x2="65%"
                y2="67%"
                stroke="url(#flowGradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse"
                style={{
                  animation: 'dash 2s linear infinite'
                }}
              />
            </svg>

            {/* Central ERP Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-[100px] h-[100px] bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border-1 border-white dark:border-gray-800">
                <div className="text-white text-center">
                  <div className="text-sm font-semibold leading-tight">Integrated</div>
                  <div className="text-xs opacity-75 mt-1">Solution</div>
                </div>
              </div>
            </div>

            {/* AI Agent Nodes */}
            {sscAgents.map((agent) => (
              <div
                key={agent.id}
                className="absolute z-20 cursor-pointer transform transition-all duration-300 hover:scale-110"
                style={{
                  left: `${agent.position.x / 10}%`,
                  top: `${agent.position.y / 3}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseEnter={() => setActiveAgent(agent.id)}
                onMouseLeave={() => setActiveAgent(null)}
              >
                <div className={`w-32 h-24 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${
                  activeAgent === agent.id ? 'ring-4 ring-blue-300 dark:ring-blue-600' : ''
                } hover:shadow-xl transition-all duration-300`}>
                  {/* Header with icon and title */}
                  <div className={`bg-gradient-to-r ${agent.color} px-3 py-2 flex items-center space-x-2`}>
                    <agent.icon className="h-4 w-4 text-white flex-shrink-0" />
                    <span className="text-white text-xs font-semibold truncate">{agent.name.replace(' AI Agent', '')}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="p-2 ">
                    {/* MODEL Section */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wide">MODEL</span>
                       
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded flex items-center justify-center">
                          <span className="text-[10px]">⚡</span>
                        </div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-300 truncate">{agent.model}</span>
                      </div>
                    </div>
                    
                    {/* TOOLS Section */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wide">TOOLS</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-[10px] font-bold text-green-600 dark:text-green-400">3</span>
                          <span className="text-gray-400">›</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Agent Info Popup */}
                {activeAgent === agent.id && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-64 z-[9999]">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">{agent.name}</h4>
                    <div className="space-y-2 mb-3">
                      {agent.tasks.map((task, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{task}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-gray-900 dark:text-white">{agent.metrics.processed}</div>
                        <div className="text-gray-500 dark:text-gray-400">Processed</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{agent.metrics.accuracy}</div>
                        <div className="text-gray-500 dark:text-gray-400">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{agent.metrics.time}</div>
                        <div className="text-gray-500 dark:text-gray-400">Avg Time</div>
                      </div>
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                  </div>
                )}
              </div>
            ))}

            {/* Data Flow Indicators */}
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">Active Processing</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <div>Active Workflows: 187</div>
                  <div>Avg Response: 1.6min</div>
                  <div>Success Rate: 98.7%</div>
                </div>
              </div>
            </div>

            {/* Process Metrics */}
            <div className="absolute bottom-4 left-4 z-20">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">Procurement Performance</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center">
                    <div className="font-bold text-green-600">17,757</div>
                    <div className="text-gray-500 dark:text-gray-400">Items Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600">98.7%</div>
                    <div className="text-gray-500 dark:text-gray-400">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600">$125K</div>
                    <div className="text-gray-500 dark:text-gray-400">Cost Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-orange-600">1.6min</div>
                    <div className="text-gray-500 dark:text-gray-400">Avg Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Process Flow Steps */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">Smart Sourcing</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                AI agents discover suppliers, automate RFQs, and select optimal vendors based on quality and cost
              </p>
              <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
                <TrendingUp className="h-3 w-3" />
                <span>98% sourcing accuracy</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">Intelligent Analysis</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                AI-powered demand forecasting and cost estimation using ERP data and market intelligence
              </p>
              <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
                <BarChart3 className="h-3 w-3" />
                <span>95% forecast accuracy</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">Automated Payment</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Intelligent invoice matching, payment processing, and vendor reconciliation with full audit trails
              </p>
              <div className="flex items-center space-x-2 text-xs text-purple-600 dark:text-purple-400">
                <CheckCircle className="h-3 w-3" />
                <span>99.8% accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animated dashed lines */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>

      {/* Floating Metrics */}
      <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500/70 to-green-600 text-white rounded-xl p-4 shadow-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">25%</div>
          <div className="text-xs opacity-90">Cost Reduction</div>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500/80 to-indigo-600 text-white rounded-xl p-4 shadow-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">70%</div>
          <div className="text-xs opacity-90">Faster Cycles</div>
        </div>
      </div>
    </div>
  );
};

export default SSCProcessVisualization;