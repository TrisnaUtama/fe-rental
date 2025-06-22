import React from 'react';
import type { Payment_Status } from '../../types/report'; // Adjust the import path as needed

/**
 * Props for the PaymentStatusBadge component.
 * The status is optional to gracefully handle cases where payment data might be missing.
 */
interface PaymentStatusBadgeProps {
  status?: Payment_Status;
}

/**
 * A badge component to display the status of a payment with appropriate coloring.
 * It shows a colored dot and formatted text for visual clarity.
 */
export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  /**
   * A mapping of each payment status to its corresponding Tailwind CSS classes.
   * 'base' class styles the badge itself (text and background color).
   * 'dot' class styles the small indicator circle.
   */
  const statusStyles: Record<Payment_Status, { base: string, dot: string }> = {
    PAID: {
      base: 'text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300',
      dot: 'bg-green-500',
    },
    PENDING: {
      base: 'text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
      dot: 'bg-yellow-500',
    },
    FAILED: {
      base: 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-300',
      dot: 'bg-red-500',
    },
    CANCELED: {
      base: 'text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-300',
      dot: 'bg-gray-500',
    },
    EXPIRED: {
      base: 'text-orange-800 bg-orange-100 dark:bg-orange-900 dark:text-orange-300',
      dot: 'bg-orange-500',
    },
  };

  // If no status is provided, render a default "Not Available" badge.
  if (!status) {
    return (
       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        N/A
      </span>
    );
  }

  const styles = statusStyles[status];
  // Format the status text (e.g., "PAID" becomes "Paid").
  const formattedStatus = status.replace(/_/g, ' ').toLowerCase();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles.base}`}
    >
      <span className={`w-2 h-2 mr-2 rounded-full ${styles.dot}`}></span>
      {formattedStatus}
    </span>
  );
};
