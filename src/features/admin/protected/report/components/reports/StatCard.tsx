import { Card } from "../ui/Card";

export const StatCard = ({ 
    icon, 
    title, 
    value, 
    color = "blue" 
}: { 
    icon: React.ReactNode, 
    title: string, 
    value: string | number, 
    color?: string 
}) => {
    const colorClasses: { [key: string]: string } = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        purple: 'bg-purple-100 text-purple-600',
        indigo: 'bg-indigo-100 text-indigo-600',
        red: 'bg-red-100 text-red-600',
    };

    return (
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 capitalize">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
};