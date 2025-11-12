import { createClient } from '@supabase/supabase-js';
import { type User } from '../types/agent';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UserRow {
  id: string;
  user_id: string;
  organization_id: string;
  department_id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  last_login: string;
  created_at: string;
  updated_at: string;
}

function mapUserRowToUser(row: UserRow): User {
  return {
    id: row.user_id,
    organizationId: row.organization_id,
    departmentId: row.department_id,
    name: row.name,
    email: row.email,
    role: row.role,
    department: row.department,
    permissions: row.permissions,
    lastLogin: row.last_login
  };
}

export class UserService {
  static async getUsers(): Promise<User[]> {
    console.log('[UserService] Fetching users from Supabase...');
    console.log('[UserService] Supabase URL:', supabaseUrl);
    console.log('[UserService] Supabase Key exists:', !!supabaseAnonKey);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('user_id', { ascending: true });

    if (error) {
      console.error('[UserService] Error fetching users:', error);
      return [];
    }

    console.log('[UserService] Users fetched:', data?.length || 0);
    console.log('[UserService] First user:', data?.[0]);

    return data ? data.map(mapUserRowToUser) : [];
  }

  static async getUserById(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }

    return data ? mapUserRowToUser(data) : undefined;
  }

  static async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user by email:', error);
      return undefined;
    }

    return data ? mapUserRowToUser(data) : undefined;
  }

  static async getUsersByOrganization(organizationId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching users by organization:', error);
      return [];
    }

    return data ? data.map(mapUserRowToUser) : [];
  }

  static async getUsersByDepartment(departmentId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('department_id', departmentId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching users by department:', error);
      return [];
    }

    return data ? data.map(mapUserRowToUser) : [];
  }

  static async getUsersByRole(role: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('role', `%${role}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching users by role:', error);
      return [];
    }

    return data ? data.map(mapUserRowToUser) : [];
  }

  static async getUsersByDepartmentName(department: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('department', `%${department}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching users by department name:', error);
      return [];
    }

    return data ? data.map(mapUserRowToUser) : [];
  }

  static async getUsersByPermission(permission: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`permissions.cs.{${permission}},permissions.cs.{admin}`)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching users by permission:', error);
      return [];
    }

    return data ? data.map(mapUserRowToUser) : [];
  }

  static async getChiefLevelUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or('role.ilike.%chief%,role.ilike.%ceo%,role.ilike.%president%')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching chief level users:', error);
      return [];
    }

    return data ? data.map(mapUserRowToUser) : [];
  }

  static async getDirectorLevelUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or('role.ilike.%director%,role.ilike.%vp%,role.ilike.%vice president%')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching director level users:', error);
      return [];
    }

    return data ? data.map(mapUserRowToUser) : [];
  }

  static async getUsersByRoleHierarchy(level: 'executive' | 'director' | 'manager' | 'staff'): Promise<User[]> {
    const users = await this.getUsers();

    switch (level) {
      case 'executive':
        return users.filter(user =>
          user.role.toLowerCase().includes('chief') ||
          user.role.toLowerCase().includes('ceo') ||
          user.role.toLowerCase().includes('president')
        );
      case 'director':
        return users.filter(user =>
          user.role.toLowerCase().includes('director') ||
          user.role.toLowerCase().includes('vp') ||
          user.role.toLowerCase().includes('vice president')
        );
      case 'manager':
        return users.filter(user =>
          user.role.toLowerCase().includes('manager') ||
          user.role.toLowerCase().includes('head')
        );
      case 'staff':
        return users.filter(user =>
          !user.role.toLowerCase().includes('chief') &&
          !user.role.toLowerCase().includes('director') &&
          !user.role.toLowerCase().includes('manager') &&
          !user.role.toLowerCase().includes('head') &&
          !user.role.toLowerCase().includes('vp')
        );
      default:
        return users;
    }
  }

  static async searchUsers(query: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,role.ilike.%${query}%,department.ilike.%${query}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error searching users:', error);
      return [];
    }

    return data ? data.map(mapUserRowToUser) : [];
  }

  static async authenticateUser(email: string, organizationId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (error) {
      console.error('Error authenticating user:', error);
      return null;
    }

    return data ? mapUserRowToUser(data) : null;
  }

  static async hasPermission(userId: string, permission: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;
    return user.permissions.includes(permission) || user.permissions.includes('admin');
  }

  static async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.getUserById(userId);
    return user?.permissions || [];
  }

  static async getAllRoles(): Promise<string[]> {
    const { data, error } = await supabase
      .from('users')
      .select('role');

    if (error) {
      console.error('Error fetching roles:', error);
      return [];
    }

    const roles = data ? data.map(row => row.role) : [];
    return [...new Set(roles)];
  }

  static async getAllDepartmentIds(): Promise<string[]> {
    const { data, error } = await supabase
      .from('users')
      .select('department_id');

    if (error) {
      console.error('Error fetching department IDs:', error);
      return [];
    }

    const deptIds = data ? data.map(row => row.department_id) : [];
    return [...new Set(deptIds)];
  }

  static async getAllDepartments(): Promise<string[]> {
    const { data, error } = await supabase
      .from('users')
      .select('department');

    if (error) {
      console.error('Error fetching departments:', error);
      return [];
    }

    const depts = data ? data.map(row => row.department) : [];
    return [...new Set(depts)];
  }

  static async getAllPermissions(): Promise<string[]> {
    const users = await this.getUsers();
    const allPermissions = users.flatMap(user => user.permissions);
    return [...new Set(allPermissions)];
  }

  static async getUserStatisticsByOrganization(organizationId: string): Promise<{
    totalUsers: number;
    executiveUsers: number;
    directorUsers: number;
    managerUsers: number;
    staffUsers: number;
    departmentDistribution: { [department: string]: number };
    roleDistribution: { [role: string]: number };
    permissionDistribution: { [permission: string]: number };
  }> {
    const orgUsers = await this.getUsersByOrganization(organizationId);

    const executiveUsers = await this.getUsersByRoleHierarchy('executive');
    const directorUsers = await this.getUsersByRoleHierarchy('director');
    const managerUsers = await this.getUsersByRoleHierarchy('manager');
    const staffUsers = await this.getUsersByRoleHierarchy('staff');

    const orgExecutives = executiveUsers.filter(u => u.organizationId === organizationId);
    const orgDirectors = directorUsers.filter(u => u.organizationId === organizationId);
    const orgManagers = managerUsers.filter(u => u.organizationId === organizationId);
    const orgStaff = staffUsers.filter(u => u.organizationId === organizationId);

    const departmentDistribution: { [department: string]: number } = {};
    orgUsers.forEach(user => {
      departmentDistribution[user.department] = (departmentDistribution[user.department] || 0) + 1;
    });

    const roleDistribution: { [role: string]: number } = {};
    orgUsers.forEach(user => {
      roleDistribution[user.role] = (roleDistribution[user.role] || 0) + 1;
    });

    const permissionDistribution: { [permission: string]: number } = {};
    orgUsers.forEach(user => {
      user.permissions.forEach(permission => {
        permissionDistribution[permission] = (permissionDistribution[permission] || 0) + 1;
      });
    });

    return {
      totalUsers: orgUsers.length,
      executiveUsers: orgExecutives.length,
      directorUsers: orgDirectors.length,
      managerUsers: orgManagers.length,
      staffUsers: orgStaff.length,
      departmentDistribution,
      roleDistribution,
      permissionDistribution
    };
  }

  static async getUserActivitySummary(): Promise<{
    totalUsers: number;
    recentlyActive: number;
    byOrganization: { [organizationId: string]: number };
    byRole: { [role: string]: number };
  }> {
    const users = await this.getUsers();

    const recentlyActive = users.filter(user =>
      user.lastLogin.includes('min ago') ||
      user.lastLogin.includes('hour ago') ||
      user.lastLogin.includes('hours ago')
    ).length;

    const byOrganization: { [organizationId: string]: number } = {};
    users.forEach(user => {
      byOrganization[user.organizationId] = (byOrganization[user.organizationId] || 0) + 1;
    });

    const byRole: { [role: string]: number } = {};
    users.forEach(user => {
      byRole[user.role] = (byRole[user.role] || 0) + 1;
    });

    return {
      totalUsers: users.length,
      recentlyActive,
      byOrganization,
      byRole
    };
  }

  static async filterUsers(filters: {
    organizationId?: string;
    role?: string;
    department?: string;
    permission?: string;
    roleLevel?: 'executive' | 'director' | 'manager' | 'staff';
    searchTerm?: string;
  }): Promise<User[]> {
    let query = supabase.from('users').select('*');

    if (filters.organizationId) {
      query = query.eq('organization_id', filters.organizationId);
    }

    if (filters.role) {
      query = query.eq('role', filters.role);
    }

    if (filters.department) {
      query = query.eq('department', filters.department);
    }

    if (filters.permission) {
      query = query.or(`permissions.cs.{${filters.permission}},permissions.cs.{admin}`);
    }

    if (filters.searchTerm) {
      query = query.or(`name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%,role.ilike.%${filters.searchTerm}%,department.ilike.%${filters.searchTerm}%`);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) {
      console.error('Error filtering users:', error);
      return [];
    }

    let users = data ? data.map(mapUserRowToUser) : [];

    if (filters.roleLevel) {
      const levelUsers = await this.getUsersByRoleHierarchy(filters.roleLevel);
      const levelUserIds = new Set(levelUsers.map(u => u.id));
      users = users.filter(user => levelUserIds.has(user.id));
    }

    return users;
  }

  static async getUserOrganizationHierarchy(userId: string): Promise<{
    user: User;
    organization: any;
    colleagues: User[];
  } | null> {
    const user = await this.getUserById(userId);
    if (!user) return null;

    const colleagues = await this.getUsersByOrganization(user.organizationId);

    return {
      user,
      organization: { id: user.organizationId },
      colleagues: colleagues.filter(c => c.id !== userId)
    };
  }
}
