import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrganizationService } from '../services/organizationService';

interface Organization {
  id: string;
  name: string;
  type: 'holding' | 'subsidiary';
  parentId?: string;
  kpis: KPI[];
}

interface KPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target: number;
}

interface OrganizationContextType {
  selectedOrganization: string;
  setSelectedOrganization: (orgId: string) => void;
  organizations: Organization[];
  getCurrentOrganization: () => Organization | undefined;
  getSubsidiaries: (parentId?: string) => Organization[];
  loading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      const orgs = await OrganizationService.getOrganizations();
      setOrganizations(orgs);
      setLoading(false);
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    const storedOrganization = localStorage.getItem('selectedOrganization');
    if (storedOrganization && !selectedOrganization) {
      setSelectedOrganization(storedOrganization);
    }
  }, [selectedOrganization]);

  const getCurrentOrganization = () => {
    if (!selectedOrganization) return undefined;
    return organizations.find(org => org.id === selectedOrganization);
  };

  const getSubsidiaries = (parentId?: string) => {
    const targetParentId = parentId || selectedOrganization;
    return organizations.filter(org => org.parentId === targetParentId);
  };

  return (
    <OrganizationContext.Provider value={{
      selectedOrganization,
      setSelectedOrganization,
      organizations,
      getCurrentOrganization,
      getSubsidiaries,
      loading
    }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
};
