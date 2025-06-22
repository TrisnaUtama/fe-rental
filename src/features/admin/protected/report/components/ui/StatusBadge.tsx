import type { Payment_Status } from "../../types/report";

export const StatusBadge = ({ status }: { status: Payment_Status }) => {
    const badgeStyles: { [key in Payment_Status]: string } = {
        PAID: "bg-green-100 text-green-800 border-green-200",
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
        FAILED: "bg-red-100 text-red-800 border-red-200",
        EXPIRED: "bg-red-100 text-red-800 border-red-200",
        CANCELED: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize border ${badgeStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
            {status.toLowerCase().replace("_", " ")}
        </span>
    );
};