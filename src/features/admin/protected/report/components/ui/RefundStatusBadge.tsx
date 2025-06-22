import type { Refund_Status } from "../../types/report";

export const RefundStatusBadge = ({ status }: { status: Refund_Status }) => {
    const badgeStyles: { [key in Refund_Status]: string } = {
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
        APPROVED: "bg-blue-100 text-blue-800 border-blue-200",
        REJECTED: "bg-red-100 text-red-800 border-red-200",
        COMPLETED: "bg-green-100 text-green-800 border-green-200",
        CANCELED_BY_USER: ""
    };
    return (
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize border ${badgeStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
            {status.toLowerCase().replace("_", " ")}
        </span>
    );
};