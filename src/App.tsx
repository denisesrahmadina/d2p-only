import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AgentProvider } from './contexts/AgentContext';
import { OrganizationProvider } from './contexts/OrganizationContext';
import Header from './components/Layout/Header';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Hero from './pages/Hero';
import Login from './pages/Login';
import Settings from './pages/Settings';
import KnowledgeModules from './pages/KnowledgeModules';
import ProcurementProcesses from './pages/ProcurementProcesses';
import DPKModule from './pages/DemandToPlan/DPKModule';
import DPKFlow from './pages/DemandToPlan/DPKFlow';
import CIModule from './pages/DemandToPlan/CIModule';import MapView from './pages/MapView';
import { AgentDataService } from './services';
import { Agent } from './types/agent';
import DemandToPlanLanding from './pages/DemandToPlan/DemandToPlanLanding';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  // Load agents data for routing
  React.useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true);
        const agentsData = await AgentDataService.getAgents();
        setAgents(agentsData);
      } catch (error) {
        console.error('Error loading agents:', error);
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <OrganizationProvider>
          <AgentProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Hero />} />
                <Route path="/login" element={<Login />} />
                
                <Route path="/procurements" element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 pt-16">
                      <Header 
                        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                        sidebarOpen={sidebarOpen}
                      />
                      
                      <main className="transition-all duration-200">
                        <div className="p-4 lg:p-8">
                          <ProcurementProcesses />
                        </div>
                      </main>
                    </div>
                    
                    {/* AI Floating Chat Assistant */}
                  </ProtectedRoute>
                } />
                
                <Route path="/knowledge-modules" element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 pt-16">
                      <Header 
                        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                        sidebarOpen={sidebarOpen}
                      />
                      
                      <main className="transition-all duration-200">
                        <div className="p-4 lg:p-8">
                          <KnowledgeModules />
                        </div>
                      </main>
                    </div>
                    
                    {/* AI Floating Chat Assistant */}

                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 pt-16">
                      <Header 
                        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                        sidebarOpen={sidebarOpen}
                      />
                      
                      <main className="transition-all duration-200">
                        <div className="p-4 lg:p-8">
                          <Settings />
                        </div>
                      </main>
                    </div>
                    
                    {/* AI Floating Chat Assistant */}

                  </ProtectedRoute>
                } />
                
                {/* Procurement Process Routes */}
                <Route path="/procurements/demand-to-plan" element={
                  <ProtectedRoute>
                    <DemandToPlanLanding /> 
                   </ProtectedRoute>
                } />

                <Route path="/procurements/demand-to-plan/dpk" element={
                  <ProtectedRoute>
                    <DPKModule />
                  </ProtectedRoute>
                } />

                <Route path="/procurements/demand-to-plan/dpk/flow" element={
                  <ProtectedRoute>
                    <DPKFlow />
                  </ProtectedRoute>
                } />

                <Route path="/procurements/demand-to-plan/ci" element={
                  <ProtectedRoute>
                    <CIModule />
                  </ProtectedRoute>
                } />

                <Route path="/map" element={
                  <ProtectedRoute>
                    <MapView />
                  </ProtectedRoute>
                } />

               
              </Routes>
            </Router>
          </AgentProvider>
        </OrganizationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;