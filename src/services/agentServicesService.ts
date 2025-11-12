export interface AgentService {
  agentId: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  lastHealthCheck: string;
  responseTime: number; // in seconds
  uptime: number; // percentage
}

export class AgentServicesService {
  /**
   * Get all agent services
   */
  static async getAgentServices(): Promise<AgentService[]> {
    const { default: agentServicesData } = await import('../data/agentServices.json');
    return agentServicesData as AgentService[];
  }

  /**
   * Get agent service by agent ID
   */
  static async getAgentServiceByAgentId(agentId: string): Promise<AgentService | undefined> {
    const services = await this.getAgentServices();
    return services.find(service => service.agentId === agentId);
  }

  /**
   * Get agent services by status
   */
  static async getAgentServicesByStatus(status: string): Promise<AgentService[]> {
    const services = await this.getAgentServices();
    return services.filter(service => service.status === status);
  }

  /**
   * Get active agent services
   */
  static async getActiveAgentServices(): Promise<AgentService[]> {
    return this.getAgentServicesByStatus('active');
  }

  /**
   * Get inactive agent services
   */
  static async getInactiveAgentServices(): Promise<AgentService[]> {
    const services = await this.getAgentServices();
    return services.filter(service => service.status !== 'active');
  }

  /**
   * Get agent services with health issues
   */
  static async getAgentServicesWithHealthIssues(): Promise<AgentService[]> {
    const services = await this.getAgentServices();
    return services.filter(service => 
      service.status === 'error' || 
      service.uptime < 95 || 
      service.responseTime > 5
    );
  }

  /**
   * Get agent services by response time range
   */
  static async getAgentServicesByResponseTime(minTime: number, maxTime: number): Promise<AgentService[]> {
    const services = await this.getAgentServices();
    return services.filter(service => 
      service.responseTime >= minTime && service.responseTime <= maxTime
    );
  }

  /**
   * Get agent services by uptime threshold
   */
  static async getAgentServicesByUptimeThreshold(minUptime: number): Promise<AgentService[]> {
    const services = await this.getAgentServices();
    return services.filter(service => service.uptime >= minUptime);
  }

  /**
   * Get agent services summary
   */
  static async getAgentServicesSummary(): Promise<{
    totalServices: number;
    activeServices: number;
    inactiveServices: number;
    averageResponseTime: number;
    averageUptime: number;
    healthyServices: number;
    servicesWithIssues: number;
  }> {
    const services = await this.getAgentServices();
    
    if (services.length === 0) {
      return {
        totalServices: 0,
        activeServices: 0,
        inactiveServices: 0,
        averageResponseTime: 0,
        averageUptime: 0,
        healthyServices: 0,
        servicesWithIssues: 0
      };
    }

    const activeServices = services.filter(s => s.status === 'active').length;
    const inactiveServices = services.length - activeServices;
    const averageResponseTime = services.reduce((sum, s) => sum + s.responseTime, 0) / services.length;
    const averageUptime = services.reduce((sum, s) => sum + s.uptime, 0) / services.length;
    const healthyServices = services.filter(s => 
      s.status === 'active' && s.uptime >= 95 && s.responseTime <= 3
    ).length;
    const servicesWithIssues = services.length - healthyServices;

    return {
      totalServices: services.length,
      activeServices,
      inactiveServices,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      averageUptime: Math.round(averageUptime * 10) / 10,
      healthyServices,
      servicesWithIssues
    };
  }

  /**
   * Get recent health check results
   */
  static async getRecentHealthCheckResults(hours: number = 24): Promise<AgentService[]> {
    const services = await this.getAgentServices();
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);

    return services.filter(service => 
      new Date(service.lastHealthCheck) >= cutoffTime
    ).sort((a, b) => 
      new Date(b.lastHealthCheck).getTime() - new Date(a.lastHealthCheck).getTime()
    );
  }

  /**
   * Get performance metrics for all services
   */
  static async getPerformanceMetrics(): Promise<{
    agentId: string;
    status: string;
    responseTime: number;
    uptime: number;
    healthScore: number;
    lastHealthCheck: string;
  }[]> {
    const services = await this.getAgentServices();
    
    return services.map(service => {
      // Calculate health score based on status, uptime, and response time
      let healthScore = 0;
      
      if (service.status === 'active') healthScore += 40;
      else if (service.status === 'maintenance') healthScore += 20;
      
      if (service.uptime >= 99) healthScore += 30;
      else if (service.uptime >= 95) healthScore += 20;
      else if (service.uptime >= 90) healthScore += 10;
      
      if (service.responseTime <= 1) healthScore += 30;
      else if (service.responseTime <= 2) healthScore += 20;
      else if (service.responseTime <= 3) healthScore += 10;

      return {
        agentId: service.agentId,
        status: service.status,
        responseTime: service.responseTime,
        uptime: service.uptime,
        healthScore: Math.min(100, healthScore),
        lastHealthCheck: service.lastHealthCheck
      };
    }).sort((a, b) => b.healthScore - a.healthScore);
  }

  /**
   * Check service health status
   */
  static async checkServiceHealth(agentId: string): Promise<{
    agentId: string;
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const service = await this.getAgentServiceByAgentId(agentId);
    
    if (!service) {
      return {
        agentId,
        isHealthy: false,
        issues: ['Service not found'],
        recommendations: ['Verify agent ID and service configuration']
      };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check status
    if (service.status !== 'active') {
      issues.push(`Service status is ${service.status}`);
      if (service.status === 'error') {
        recommendations.push('Investigate error logs and restart service');
      } else if (service.status === 'maintenance') {
        recommendations.push('Complete maintenance and activate service');
      }
    }

    // Check uptime
    if (service.uptime < 95) {
      issues.push(`Low uptime: ${service.uptime}%`);
      recommendations.push('Investigate frequent downtime causes');
    }

    // Check response time
    if (service.responseTime > 3) {
      issues.push(`High response time: ${service.responseTime}s`);
      recommendations.push('Optimize service performance or scale resources');
    }

    // Check last health check
    const lastCheck = new Date(service.lastHealthCheck);
    const now = new Date();
    const hoursSinceCheck = (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceCheck > 1) {
      issues.push(`Health check overdue: ${Math.round(hoursSinceCheck)} hours ago`);
      recommendations.push('Run health check to verify service status');
    }

    return {
      agentId,
      isHealthy: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Get service endpoint information
   */
  static async getServiceEndpoint(agentId: string): Promise<{
    agentId: string;
    endpoint: string;
    method: string;
    isAvailable: boolean;
  } | null> {
    const service = await this.getAgentServiceByAgentId(agentId);
    
    if (!service) return null;

    return {
      agentId: service.agentId,
      endpoint: service.endpoint,
      method: service.method,
      isAvailable: service.status === 'active'
    };
  }

  /**
   * Search agent services
   */
  static async searchAgentServices(query: string): Promise<AgentService[]> {
    const services = await this.getAgentServices();
    const lowerQuery = query.toLowerCase();
    
    return services.filter(service => 
      service.agentId.toLowerCase().includes(lowerQuery) ||
      service.endpoint.toLowerCase().includes(lowerQuery) ||
      service.status.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter agent services by multiple criteria
   */
  static async filterAgentServices(filters: {
    status?: string;
    minUptime?: number;
    maxResponseTime?: number;
    healthCheckWithinHours?: number;
  }): Promise<AgentService[]> {
    let services = await this.getAgentServices();

    if (filters.status) {
      services = services.filter(service => service.status === filters.status);
    }

    if (filters.minUptime !== undefined) {
      services = services.filter(service => service.uptime >= filters.minUptime!);
    }

    if (filters.maxResponseTime !== undefined) {
      services = services.filter(service => service.responseTime <= filters.maxResponseTime!);
    }

    if (filters.healthCheckWithinHours !== undefined) {
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - filters.healthCheckWithinHours);
      services = services.filter(service => 
        new Date(service.lastHealthCheck) >= cutoffTime
      );
    }

    return services;
  }

  /**
   * Get service status distribution
   */
  static async getServiceStatusDistribution(): Promise<{
    [status: string]: number;
  }> {
    const services = await this.getAgentServices();
    const distribution: { [status: string]: number } = {};

    services.forEach(service => {
      distribution[service.status] = (distribution[service.status] || 0) + 1;
    });

    return distribution;
  }

  /**
   * Get services requiring attention
   */
  static async getServicesRequiringAttention(): Promise<{
    service: AgentService;
    issues: string[];
    priority: 'high' | 'medium' | 'low';
  }[]> {
    const services = await this.getAgentServices();
    const servicesWithIssues: any[] = [];

    for (const service of services) {
      const healthCheck = await this.checkServiceHealth(service.agentId);
      
      if (!healthCheck.isHealthy) {
        let priority: 'high' | 'medium' | 'low' = 'low';
        
        if (service.status === 'error' || service.uptime < 90) {
          priority = 'high';
        } else if (service.uptime < 95 || service.responseTime > 3) {
          priority = 'medium';
        }

        servicesWithIssues.push({
          service,
          issues: healthCheck.issues,
          priority
        });
      }
    }

    return servicesWithIssues.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Update service status
   */
  static async updateServiceStatus(agentId: string, status: AgentService['status']): Promise<AgentService | null> {
    // In a real implementation, this would make an API call
    const service = await this.getAgentServiceByAgentId(agentId);
    if (!service) return null;

    return {
      ...service,
      status,
      lastHealthCheck: new Date().toISOString()
    };
  }

  /**
   * Perform health check for service
   */
  static async performHealthCheck(agentId: string): Promise<{
    agentId: string;
    status: string;
    responseTime: number;
    timestamp: string;
    success: boolean;
    error?: string;
  }> {
    // In a real implementation, this would make an actual HTTP request to the service endpoint
    const service = await this.getAgentServiceByAgentId(agentId);
    
    if (!service) {
      return {
        agentId,
        status: 'not_found',
        responseTime: 0,
        timestamp: new Date().toISOString(),
        success: false,
        error: 'Service not found'
      };
    }

    // Simulate health check
    const responseTime = Math.random() * 2 + 0.5; // 0.5-2.5 seconds
    const success = Math.random() > 0.05; // 95% success rate

    return {
      agentId,
      status: success ? 'healthy' : 'unhealthy',
      responseTime: Math.round(responseTime * 100) / 100,
      timestamp: new Date().toISOString(),
      success,
      error: success ? undefined : 'Service timeout or connection error'
    };
  }

  /**
   * Get all unique statuses
   */
  static async getStatuses(): Promise<string[]> {
    return ['active', 'inactive', 'maintenance', 'error'];
  }

  /**
   * Get all unique methods
   */
  static async getMethods(): Promise<string[]> {
    const services = await this.getAgentServices();
    return [...new Set(services.map(service => service.method))];
  }

  /**
   * Get service uptime statistics
   */
  static async getUptimeStatistics(): Promise<{
    averageUptime: number;
    highestUptime: number;
    lowestUptime: number;
    servicesAbove99: number;
    servicesAbove95: number;
    servicesBelow95: number;
  }> {
    const services = await this.getAgentServices();
    
    if (services.length === 0) {
      return {
        averageUptime: 0,
        highestUptime: 0,
        lowestUptime: 0,
        servicesAbove99: 0,
        servicesAbove95: 0,
        servicesBelow95: 0
      };
    }

    const uptimes = services.map(s => s.uptime);
    const averageUptime = uptimes.reduce((sum, uptime) => sum + uptime, 0) / services.length;

    return {
      averageUptime: Math.round(averageUptime * 10) / 10,
      highestUptime: Math.max(...uptimes),
      lowestUptime: Math.min(...uptimes),
      servicesAbove99: services.filter(s => s.uptime >= 99).length,
      servicesAbove95: services.filter(s => s.uptime >= 95).length,
      servicesBelow95: services.filter(s => s.uptime < 95).length
    };
  }

  /**
   * Get response time statistics
   */
  static async getResponseTimeStatistics(): Promise<{
    averageResponseTime: number;
    fastestResponseTime: number;
    slowestResponseTime: number;
    servicesUnder1s: number;
    servicesUnder2s: number;
    servicesOver3s: number;
  }> {
    const services = await this.getAgentServices();
    
    if (services.length === 0) {
      return {
        averageResponseTime: 0,
        fastestResponseTime: 0,
        slowestResponseTime: 0,
        servicesUnder1s: 0,
        servicesUnder2s: 0,
        servicesOver3s: 0
      };
    }

    const responseTimes = services.map(s => s.responseTime);
    const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / services.length;

    return {
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      fastestResponseTime: Math.min(...responseTimes),
      slowestResponseTime: Math.max(...responseTimes),
      servicesUnder1s: services.filter(s => s.responseTime < 1).length,
      servicesUnder2s: services.filter(s => s.responseTime < 2).length,
      servicesOver3s: services.filter(s => s.responseTime > 3).length
    };
  }

  /**
   * Get service health trends (mock data for demonstration)
   */
  static async getServiceHealthTrends(agentId: string, days: number = 7): Promise<{
    date: string;
    uptime: number;
    responseTime: number;
    status: string;
  }[]> {
    // In a real implementation, this would fetch historical data
    const trends: any[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        uptime: Math.random() * 5 + 95, // 95-100%
        responseTime: Math.random() * 2 + 0.5, // 0.5-2.5s
        status: Math.random() > 0.1 ? 'active' : 'maintenance'
      });
    }
    
    return trends;
  }

  /**
   * Test service connectivity
   */
  static async testServiceConnectivity(agentId: string): Promise<{
    agentId: string;
    endpoint: string;
    isReachable: boolean;
    responseTime: number;
    statusCode?: number;
    error?: string;
  }> {
    const service = await this.getAgentServiceByAgentId(agentId);
    
    if (!service) {
      return {
        agentId,
        endpoint: 'unknown',
        isReachable: false,
        responseTime: 0,
        error: 'Service configuration not found'
      };
    }

    // In a real implementation, this would make an actual HTTP request
    // For now, simulate the connectivity test
    const responseTime = Math.random() * 3 + 0.2; // 0.2-3.2 seconds
    const isReachable = Math.random() > 0.05; // 95% success rate
    const statusCode = isReachable ? 200 : 500;

    return {
      agentId,
      endpoint: service.endpoint,
      isReachable,
      responseTime: Math.round(responseTime * 100) / 100,
      statusCode,
      error: isReachable ? undefined : 'Connection timeout or service unavailable'
    };
  }
}