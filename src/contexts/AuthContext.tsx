import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  selectedOrganization: string | null;
  isAuthenticated: boolean;
  login: (user: User, organizationId: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user session on app start
  useEffect(() => {
    const restoreSession = () => {
      console.log('🔄 [AUTH] Attempting to restore session from localStorage...');
      
      const storedUser = localStorage.getItem('currentUser');
      const storedOrganization = localStorage.getItem('selectedOrganization');
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      
      console.log('📦 [AUTH] Found in localStorage:', {
        hasStoredUser: !!storedUser,
        hasStoredOrganization: !!storedOrganization,
        isAuthenticated: isAuthenticated
      });
      
      if (storedUser && storedOrganization && isAuthenticated === 'true') {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.id && parsedUser.email) {
            console.log('✅ [AUTH] Session restored successfully:', {
              email: parsedUser.email,
              selectedOrganization: storedOrganization
            });
            
            if (parsedUser && parsedUser.id && parsedUser.organizationId) {
              setUser(parsedUser);
              setSelectedOrganization(storedOrganization);
              console.log('✅ [AUTH] User session restored:', {
                name: parsedUser.name,
                organizationId: parsedUser.organizationId,
                role: parsedUser.role,
                department: parsedUser.department
              });
            }
          }
        } catch (error) {
          console.error('❌ [AUTH] Error parsing stored user data:', error);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('selectedOrganization');
          localStorage.removeItem('isAuthenticated');
        }
      } else {
        console.log('ℹ️ [AUTH] No stored user session found');
      }
      
      setIsLoading(false);
    };
    
    restoreSession();
  }, []);

  const login = (userData: User, organizationId: string) => {
    console.log('🔐 [AUTH] Logging in user:', {
      name: userData.name,
      email: userData.email,
      organizationId,
      role: userData.role,
      department: userData.department
    });
    
    // Update state first
    setUser(userData);
    setSelectedOrganization(organizationId);
    
    // Then update localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('selectedOrganization', organizationId);
    localStorage.setItem('isAuthenticated', 'true');
    
    console.log('✅ [AUTH] User logged in successfully');
    console.log('💾 [AUTH] Session data stored in localStorage');
  };

  const logout = () => {
    console.log('🚪 [AUTH] Logging out user');
    setUser(null);
    setSelectedOrganization(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('selectedOrganization');
    localStorage.removeItem('isAuthenticated');
    console.log('✅ [AUTH] User logged out successfully');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.permissions.includes('admin');
  };

  const isAuthenticated = !!user && !!selectedOrganization;

  // Show loading state while checking for existing session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking session...</p>
        </div>
      </div>
    );
  }
  return (
    <AuthContext.Provider value={{
      user,
      selectedOrganization,
      isAuthenticated,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};