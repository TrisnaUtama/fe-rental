import React from 'react';
import type { Booking_Status } from '../../types/report'; 

interface BookingStatusBadgeProps {
  status?: Booking_Status;
}
export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
    const statusConfig: Record<Booking_Status, { label: string; color: string; dot: string }> = {
        COMPLETE: { label: 'Complete', color: 'text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300', dot: 'bg-green-500' },
        CONFIRMED: { label: 'Confirmed', color: 'text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300', dot: 'bg-green-500' },
        REFUNDED: { label: 'Refunded', color: 'text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300', dot: 'bg-green-500' },

        RECEIVED: { label: 'Received', color: 'text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300', dot: 'bg-blue-500' },
        RESCHEDULED: { label: 'Rescheduled', color: 'text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300', dot: 'bg-blue-500' },
        SUBMITTED: { label: 'Submitted', color: 'text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300', dot: 'bg-blue-500' },

        PAYMENT_PENDING: { label: 'Payment Pending', color: 'text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300', dot: 'bg-yellow-500' },
        REFUND_REQUESTED: { label: 'Refund Requested', color: 'text-orange-800 bg-orange-100 dark:bg-orange-900 dark:text-orange-300', dot: 'bg-orange-500' },
        RESCHEDULE_REQUESTED: { label: 'Reschedule Req.', color: 'text-orange-800 bg-orange-100 dark:bg-orange-900 dark:text-orange-300', dot: 'bg-orange-500' },

        CANCELED: { label: 'Canceled', color: 'text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-300', dot: 'bg-gray-500' },
        REJECTED_BOOKING: { label: 'Booking Rejected', color: 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-300', dot: 'bg-red-500' },
        REJECTED_REFUND: { label: 'Refund Rejected', color: 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-300', dot: 'bg-red-500' },
        REJECTED_RESHEDULE: { label: 'Reschedule Rejected', color: 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-300', dot: 'bg-red-500' },
    };

  if (!status) {
    return (
       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        N/A
      </span>
    );
  }

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.color}`}
    >
      <span className={`w-2 h-2 mr-2 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
};
