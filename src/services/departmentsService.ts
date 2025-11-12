import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  employees: number;
  icon: string;
  organizationId: string;
}

interface DepartmentRow {
  id: string;
  department_id: string;
  name: string;
  description: string;
  head: string;
  employees: number;
  icon: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

function mapDepartmentRowToDepartment(row: DepartmentRow): Department {
  return {
    id: row.department_id,
    name: row.name,
    description: row.description,
    head: row.head,
    employees: row.employees,
    icon: row.icon,
    organizationId: row.organization_id
  };
}

export class DepartmentsService {
  static async getDepartments(): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching departments:', error);
      return [];
    }

    return data ? data.map(mapDepartmentRowToDepartment) : [];
  }

  static async getDepartmentById(id: string): Promise<Department | undefined> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('department_id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching department:', error);
      return undefined;
    }

    return data ? mapDepartmentRowToDepartment(data) : undefined;
  }

  static async getDepartmentsByOrganization(organizationId: string): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching departments by organization:', error);
      return [];
    }

    return data ? data.map(mapDepartmentRowToDepartment) : [];
  }

  static async getDepartmentByHead(headName: string): Promise<Department | undefined> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .ilike('head', `%${headName}%`)
      .maybeSingle();

    if (error) {
      console.error('Error fetching department by head:', error);
      return undefined;
    }

    return data ? mapDepartmentRowToDepartment(data) : undefined;
  }

  static async searchDepartments(query: string): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,head.ilike.%${query}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error searching departments:', error);
      return [];
    }

    return data ? data.map(mapDepartmentRowToDepartment) : [];
  }

  static async getDepartmentsByEmployeeRange(min: number, max: number): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .gte('employees', min)
      .lte('employees', max)
      .order('employees', { ascending: false });

    if (error) {
      console.error('Error fetching departments by employee range:', error);
      return [];
    }

    return data ? data.map(mapDepartmentRowToDepartment) : [];
  }

  static async getLargestDepartments(organizationId: string, limit: number = 5): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('organization_id', organizationId)
      .order('employees', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching largest departments:', error);
      return [];
    }

    return data ? data.map(mapDepartmentRowToDepartment) : [];
  }

  static async getDepartmentStatistics(organizationId: string): Promise<{
    totalDepartments: number;
    totalEmployees: number;
    averageEmployeesPerDepartment: number;
    largestDepartment: Department | null;
    smallestDepartment: Department | null;
  }> {
    const departments = await this.getDepartmentsByOrganization(organizationId);

    if (departments.length === 0) {
      return {
        totalDepartments: 0,
        totalEmployees: 0,
        averageEmployeesPerDepartment: 0,
        largestDepartment: null,
        smallestDepartment: null
      };
    }

    const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0);
    const sortedBySize = [...departments].sort((a, b) => b.employees - a.employees);

    return {
      totalDepartments: departments.length,
      totalEmployees,
      averageEmployeesPerDepartment: Math.round(totalEmployees / departments.length),
      largestDepartment: sortedBySize[0],
      smallestDepartment: sortedBySize[sortedBySize.length - 1]
    };
  }

  static async getOrganizationIds(): Promise<string[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('organization_id');

    if (error) {
      console.error('Error fetching organization IDs:', error);
      return [];
    }

    const orgIds = data ? data.map(row => row.organization_id) : [];
    return [...new Set(orgIds)];
  }

  static async getDepartmentHierarchy(): Promise<{
    [organizationId: string]: Department[]
  }> {
    const departments = await this.getDepartments();
    const hierarchy: { [organizationId: string]: Department[] } = {};

    departments.forEach(dept => {
      if (!hierarchy[dept.organizationId]) {
        hierarchy[dept.organizationId] = [];
      }
      hierarchy[dept.organizationId].push(dept);
    });

    Object.keys(hierarchy).forEach(orgId => {
      hierarchy[orgId].sort((a, b) => b.employees - a.employees);
    });

    return hierarchy;
  }

  static async filterDepartments(filters: {
    organizationId?: string;
    minEmployees?: number;
    maxEmployees?: number;
    head?: string;
    searchTerm?: string;
  }): Promise<Department[]> {
    let query = supabase.from('departments').select('*');

    if (filters.organizationId) {
      query = query.eq('organization_id', filters.organizationId);
    }

    if (filters.minEmployees !== undefined) {
      query = query.gte('employees', filters.minEmployees);
    }

    if (filters.maxEmployees !== undefined) {
      query = query.lte('employees', filters.maxEmployees);
    }

    if (filters.head) {
      query = query.ilike('head', `%${filters.head}%`);
    }

    if (filters.searchTerm) {
      query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,head.ilike.%${filters.searchTerm}%`);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) {
      console.error('Error filtering departments:', error);
      return [];
    }

    return data ? data.map(mapDepartmentRowToDepartment) : [];
  }

  static async getGlobalDepartmentSummary(): Promise<{
    totalDepartments: number;
    totalEmployees: number;
    departmentsByOrganization: { [orgId: string]: number };
    employeesByOrganization: { [orgId: string]: number };
    averageDepartmentSize: number;
  }> {
    const departments = await this.getDepartments();

    const departmentsByOrganization: { [orgId: string]: number } = {};
    const employeesByOrganization: { [orgId: string]: number } = {};

    departments.forEach(dept => {
      departmentsByOrganization[dept.organizationId] = (departmentsByOrganization[dept.organizationId] || 0) + 1;
      employeesByOrganization[dept.organizationId] = (employeesByOrganization[dept.organizationId] || 0) + dept.employees;
    });

    const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0);

    return {
      totalDepartments: departments.length,
      totalEmployees,
      departmentsByOrganization,
      employeesByOrganization,
      averageDepartmentSize: departments.length > 0 ? Math.round(totalEmployees / departments.length) : 0
    };
  }
}
