import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { User as UserIcon, Mail, Phone } from "lucide-react";
import type { BookingResponse } from "../../types/booking.type";
import React from "react";

const SpecItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode; }) => (<div><div className="text-xs text-gray-500 flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" />{label}</div><div className="text-sm font-semibold text-gray-800 mt-1">{value}</div></div>);

export const CustomerInfo = ({ booking }: { booking: BookingResponse }) => (
    <Card className="rounded-2xl shadow-sm">
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-blue-500"/>Customer Details
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <SpecItem icon={UserIcon} label="Name" value={booking.users?.name || 'N/A'} />
            <SpecItem icon={Mail} label="Email" value={booking.users?.email || 'N/A'} />
            <SpecItem icon={Phone} label="Phone Number" value={booking.users?.phone_number || 'N/A'} />
        </CardContent>
    </Card>
);