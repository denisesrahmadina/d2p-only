import { SourcingEvent, SourcingEventMilestone } from './sourcingEventService';
import { UserService } from './userService';
import { type User } from '../types/agent';

export interface AssignmentSuggestion {
  userId: string;
  userName: string;
  userRole: string;
  score: number;
  reasoning: {
    workloadScore: number;
    expertiseScore: number;
    availabilityScore: number;
    totalScore: number;
    explanation: string;
  };
}

export interface MilestoneSuggestion {
  milestone_name: string;
  milestone_date: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  notes: string;
}

export interface AssignmentResult {
  suggestedPersonnel: AssignmentSuggestion[];
  suggestedMilestones: MilestoneSuggestion[];
  timeline: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
}

export class AIAssignmentService {
  static async generateAssignments(
    sourcingEvent: SourcingEvent,
    organizationId: string
  ): Promise<AssignmentResult> {
    const personnel = await this.suggestPersonnel(sourcingEvent, organizationId);
    const milestones = await this.generateMilestones(sourcingEvent);
    const timeline = this.calculateTimeline(sourcingEvent, milestones);

    return {
      suggestedPersonnel: personnel,
      suggestedMilestones: milestones,
      timeline
    };
  }

  private static async suggestPersonnel(
    sourcingEvent: SourcingEvent,
    organizationId: string
  ): Promise<AssignmentSuggestion[]> {
    const procurementStaff = await this.getProcurementStaff(organizationId);
    const suggestions: AssignmentSuggestion[] = [];

    for (const user of procurementStaff) {
      const workloadScore = await this.calculateWorkloadScore(user.id);
      const expertiseScore = this.calculateExpertiseScore(user, sourcingEvent);
      const availabilityScore = this.calculateAvailabilityScore(user);

      const totalScore = (workloadScore * 0.4) + (expertiseScore * 0.35) + (availabilityScore * 0.25);

      const explanation = this.generateExplanation(
        user,
        workloadScore,
        expertiseScore,
        availabilityScore
      );

      suggestions.push({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        score: Math.round(totalScore * 100) / 100,
        reasoning: {
          workloadScore: Math.round(workloadScore * 100) / 100,
          expertiseScore: Math.round(expertiseScore * 100) / 100,
          availabilityScore: Math.round(availabilityScore * 100) / 100,
          totalScore: Math.round(totalScore * 100) / 100,
          explanation
        }
      });
    }

    return suggestions.sort((a, b) => b.score - a.score);
  }

  private static async getProcurementStaff(organizationId: string): Promise<User[]> {
    const allUsers = await UserService.getUsersByOrganization(organizationId);

    return allUsers.filter(user => {
      const role = user.role.toLowerCase();
      return (
        role.includes('procurement') ||
        role.includes('sourcing') ||
        role.includes('buyer') ||
        role.includes('purchasing') ||
        user.department.toLowerCase().includes('procurement') ||
        user.department.toLowerCase().includes('sourcing')
      );
    });
  }

  private static async calculateWorkloadScore(userId: string): Promise<number> {
    const activeAssignments = await this.getActiveAssignmentCount(userId);

    if (activeAssignments === 0) return 10.0;
    if (activeAssignments === 1) return 8.5;
    if (activeAssignments === 2) return 7.0;
    if (activeAssignments === 3) return 5.5;
    if (activeAssignments === 4) return 4.0;
    return Math.max(1.0, 10.0 - (activeAssignments * 1.5));
  }

  private static async getActiveAssignmentCount(userId: string): Promise<number> {
    return Math.floor(Math.random() * 5);
  }

  private static calculateExpertiseScore(user: User, sourcingEvent: SourcingEvent): number {
    const category = sourcingEvent.category?.toLowerCase() || '';
    const userName = user.name.toLowerCase();
    const userRole = user.role.toLowerCase();
    const userDept = user.department.toLowerCase();

    let score = 5.0;

    if (category.includes('engine') && (userName.includes('mechanical') || userDept.includes('mechanical'))) {
      score += 3.0;
    } else if (category.includes('electronic') && (userName.includes('electric') || userDept.includes('electric'))) {
      score += 3.0;
    } else if (category.includes('it') && userDept.includes('it')) {
      score += 3.0;
    }

    if (userRole.includes('senior') || userRole.includes('lead')) {
      score += 2.0;
    } else if (userRole.includes('specialist')) {
      score += 1.5;
    }

    const estimatedBudget = sourcingEvent.estimate_price || 0;
    if (estimatedBudget > 1000000000) {
      if (userRole.includes('senior') || userRole.includes('manager')) {
        score += 1.5;
      }
    }

    return Math.min(10.0, score);
  }

  private static calculateAvailabilityScore(user: User): number {
    const lastLogin = user.lastLogin.toLowerCase();

    if (lastLogin.includes('min ago') || lastLogin.includes('hour ago')) {
      return 10.0;
    } else if (lastLogin.includes('hours ago') || lastLogin.includes('today')) {
      return 8.5;
    } else if (lastLogin.includes('yesterday') || lastLogin.includes('day ago')) {
      return 7.0;
    } else if (lastLogin.includes('days ago')) {
      return 5.5;
    }

    return 5.0;
  }

  private static generateExplanation(
    user: User,
    workloadScore: number,
    expertiseScore: number,
    availabilityScore: number
  ): string {
    const parts: string[] = [];

    if (workloadScore >= 8.0) {
      parts.push('Light workload (highly available)');
    } else if (workloadScore >= 6.0) {
      parts.push('Moderate workload');
    } else {
      parts.push('Heavy workload');
    }

    if (expertiseScore >= 8.0) {
      parts.push('high expertise match');
    } else if (expertiseScore >= 6.0) {
      parts.push('good expertise match');
    } else {
      parts.push('general procurement skills');
    }

    if (availabilityScore >= 8.0) {
      parts.push('recently active');
    } else if (availabilityScore >= 6.0) {
      parts.push('active user');
    }

    return parts.join(', ');
  }

  private static async generateMilestones(
    sourcingEvent: SourcingEvent
  ): Promise<MilestoneSuggestion[]> {
    const deliveryDate = sourcingEvent.delivery_date
      ? new Date(sourcingEvent.delivery_date)
      : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    const estimatedBudget = sourcingEvent.estimate_price || 0;
    const complexity = this.assessComplexity(sourcingEvent);

    let totalPreparationDays = 45;
    if (complexity === 'high') {
      totalPreparationDays = 60;
    } else if (complexity === 'medium') {
      totalPreparationDays = 45;
    } else {
      totalPreparationDays = 30;
    }

    const startDate = new Date(deliveryDate);
    startDate.setDate(startDate.getDate() - totalPreparationDays);

    const milestones: MilestoneSuggestion[] = [];

    const docPrepDate = new Date(startDate);
    docPrepDate.setDate(docPrepDate.getDate() + Math.floor(totalPreparationDays * 0.2));
    milestones.push({
      milestone_name: 'Document Preparation',
      milestone_date: docPrepDate.toISOString().split('T')[0],
      status: 'Pending',
      notes: 'Prepare tender documents, terms of reference, and specifications'
    });

    const vendorBriefingDate = new Date(startDate);
    vendorBriefingDate.setDate(vendorBriefingDate.getDate() + Math.floor(totalPreparationDays * 0.35));
    milestones.push({
      milestone_name: 'Vendor Briefing',
      milestone_date: vendorBriefingDate.toISOString().split('T')[0],
      status: 'Pending',
      notes: 'Conduct vendor briefing session and clarification meeting'
    });

    const submissionDate = new Date(startDate);
    submissionDate.setDate(submissionDate.getDate() + Math.floor(totalPreparationDays * 0.6));
    milestones.push({
      milestone_name: 'Submission Deadline',
      milestone_date: submissionDate.toISOString().split('T')[0],
      status: 'Pending',
      notes: 'Final deadline for vendor proposal submission'
    });

    const evaluationDate = new Date(startDate);
    evaluationDate.setDate(evaluationDate.getDate() + Math.floor(totalPreparationDays * 0.8));
    milestones.push({
      milestone_name: 'Evaluation Period',
      milestone_date: evaluationDate.toISOString().split('T')[0],
      status: 'Pending',
      notes: 'Technical and commercial evaluation of proposals'
    });

    const awardDate = new Date(startDate);
    awardDate.setDate(awardDate.getDate() + totalPreparationDays);
    milestones.push({
      milestone_name: 'Award Announcement',
      milestone_date: awardDate.toISOString().split('T')[0],
      status: 'Pending',
      notes: 'Announce winning vendor and contract award'
    });

    return milestones;
  }

  private static assessComplexity(sourcingEvent: SourcingEvent): 'low' | 'medium' | 'high' {
    const estimatedBudget = sourcingEvent.estimate_price || 0;
    const materialCount = Array.isArray(sourcingEvent.material_ids)
      ? sourcingEvent.material_ids.length
      : 0;
    const vendorCount = Array.isArray(sourcingEvent.shortlisted_vendors)
      ? sourcingEvent.shortlisted_vendors.length
      : 0;

    let complexityScore = 0;

    if (estimatedBudget > 2000000000) {
      complexityScore += 3;
    } else if (estimatedBudget > 1000000000) {
      complexityScore += 2;
    } else if (estimatedBudget > 500000000) {
      complexityScore += 1;
    }

    if (materialCount > 10) {
      complexityScore += 2;
    } else if (materialCount > 5) {
      complexityScore += 1;
    }

    if (vendorCount > 8) {
      complexityScore += 1;
    }

    if (complexityScore >= 5) return 'high';
    if (complexityScore >= 3) return 'medium';
    return 'low';
  }

  private static calculateTimeline(
    sourcingEvent: SourcingEvent,
    milestones: MilestoneSuggestion[]
  ): { startDate: string; endDate: string; totalDays: number } {
    if (milestones.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      return {
        startDate: today,
        endDate: today,
        totalDays: 0
      };
    }

    const dates = milestones.map(m => new Date(m.milestone_date));
    const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalDays
    };
  }

  static async canUserApprove(user: User): Promise<boolean> {
    const role = user.role.toLowerCase();
    return (
      role.includes('manager') ||
      role.includes('director') ||
      role.includes('chief') ||
      role.includes('head') ||
      role.includes('vp') ||
      role.includes('vice president')
    );
  }

  static async getUsersWithApprovalAuthority(organizationId: string): Promise<User[]> {
    const allUsers = await UserService.getUsersByOrganization(organizationId);
    const approvers: User[] = [];

    for (const user of allUsers) {
      if (await this.canUserApprove(user)) {
        approvers.push(user);
      }
    }

    return approvers;
  }
}
