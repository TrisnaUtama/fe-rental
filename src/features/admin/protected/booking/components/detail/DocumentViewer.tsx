import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { FileText } from "lucide-react";
import type { BookingResponse } from "../../types/booking.type";

export const DocumentViewer = ({ booking }: { booking: BookingResponse }) => (
    <Card className="rounded-2xl shadow-sm">
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500"/>Uploaded Documents
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {booking.card_id ? (
                    <a href={booking.card_id} target="_blank" rel="noopener noreferrer" className="block group border rounded-lg overflow-hidden bg-gray-50 transition-shadow hover:shadow-md">
                        <p className="font-medium text-sm p-3 border-b">Identity Card (KTP)</p>
                        <img src={booking.card_id} alt="Identity Card" className="w-full h-48 object-contain p-2" />
                    </a>
                ) : ( <div className="border rounded-lg p-6 text-center text-gray-500 bg-gray-50 h-full flex flex-col items-center justify-center"><FileText className="w-8 h-8 mb-2"/><p>No Identity Card uploaded.</p></div>)}
                 {booking.licences_id ? (
                    <a href={booking.licences_id} target="_blank" rel="noopener noreferrer" className="block group border rounded-lg overflow-hidden bg-gray-50 transition-shadow hover:shadow-md">
                        <p className="font-medium text-sm p-3 border-b">Driving License (SIM)</p>
                        <img src={booking.licences_id} alt="Driving License" className="w-full h-48 object-contain p-2" />
                    </a>
                ) : ( <div className="border rounded-lg p-6 text-center text-gray-500 bg-gray-50 h-full flex flex-col items-center justify-center"><FileText className="w-8 h-8 mb-2"/><p>No Driving License uploaded.</p></div>)}
            </div>
        </CardContent>
    </Card>
);