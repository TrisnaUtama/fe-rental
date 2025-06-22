import type { RescheduleStatus } from "../../types/report";

export const RescheduleStatusBadge = ({ status }: { status: RescheduleStatus }) => {
    const statusStyles: Record<RescheduleStatus, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        APPROVED: "bg-blue-100 text-blue-800",
        REJECTED: "bg-red-100 text-red-800",
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full inline-block ${statusStyles[status]}`}>{status}</span>;
};