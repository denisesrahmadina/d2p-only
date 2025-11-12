import React from 'react';

type StatusType = 'pending' | 'approved' | 'in-progress' | 'completed' | 'canceled' | 'rejected';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-') as StatusType;

  const getStatusStyles = (statusKey: StatusType) => {
    const styles = {
      pending: 'bg-status-pending-light dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800',
      approved: 'bg-status-approved-light dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-800',
      'in-progress': 'bg-status-in-progress-light dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      completed: 'bg-status-completed-light dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      canceled: 'bg-status-canceled-light dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800',
      rejected: 'bg-status-rejected-light dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800',
    };
    return styles[statusKey] || 'bg-gray-100 dark:bg-neutral-dark-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-neutral-dark-600';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-sm px-4 py-1.5';
      default:
        return 'text-xs px-3 py-1';
    }
  };

  const formatStatus = (statusText: string) => {
    return statusText
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${getSizeClasses()} ${getStatusStyles(
        normalizedStatus
      )} ${className}`}
    >
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;
