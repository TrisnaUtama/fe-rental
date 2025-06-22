import { Card } from "@/shared/components/ui/card";
import { Calendar, Clock, User, Users, Car, FileText, Hotel } from "lucide-react";
import type { BookingResponse } from "../../../types/booking.type";
import React from "react";
import { format, differenceInCalendarDays } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode; }) => (
    <div className="flex flex-col gap-1.5">
        <div className="text-xs text-gray-500 flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {label}
        </div>
        <p className="text-sm font-semibold text-gray-800 break-words">{value}</p>
    </div>
);

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const listItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};


export function BookingInfoCard({ booking }: { booking: BookingResponse }) {
    const duration = booking.end_date ? differenceInCalendarDays(new Date(booking.end_date), new Date(booking.start_date)) + 1 : 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="rounded-2xl shadow-sm w-full overflow-hidden">
                {/* --- Hero Image for the Travel Package --- */}
                {booking.travel_package?.image && (
                    <div className="h-64 w-full">
                        <img src={booking.travel_package.image} alt={booking.travel_package.name} className="w-full h-full object-cover"/>
                    </div>
                )}
                
                <div className="p-6 space-y-6">
                    {/* --- Package Title & Description --- */}
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {booking.travel_package?.name || "Booking Details"}
                        </h3>
                        {booking.travel_package?.description && (
                             <p className="text-sm text-gray-600 mt-2 leading-relaxed">{booking.travel_package.description}</p>
                        )}
                    </div>

                     {/* --- Key Details Grid --- */}
                    <div className="pt-6 border-t">
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
                            <DetailItem icon={User} label="Customer" value={booking.users?.name || 'N/A'} />
                            <DetailItem icon={Calendar} label="Start Date" value={format(new Date(booking.start_date), "dd MMMM, yyyy", { locale: id })} />
                            <DetailItem icon={Calendar} label="End Date" value={booking.end_date ? format(new Date(booking.end_date), "dd MMMM, yyyy", { locale: id }) : 'N/A'} />
                            <DetailItem icon={Clock} label="Duration" value={`${duration} Day(s)`} />
                            {booking.pax_option && (
                                <DetailItem icon={Users} label="Group Size" value={`${booking.pax_option.pax} People`} />
                            )}
                        </div>
                    </div>

                    {/* --- Accommodation Section (Dynamic) --- */}
                    <div className="pt-6 border-t">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                            <Hotel className="w-5 h-5 text-blue-500" />
                            Accommodation
                        </h4>
                        {booking.travel_package?.accomodation ? (
                             <motion.div variants={listItemVariants} initial="hidden" animate="visible" transition={{delay: 0.2}}>
                                <div className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                                    <img
                                        src={booking.travel_package.accomodation.image_urls[0]}
                                        alt={booking.travel_package.accomodation.name}
                                        className="w-24 h-24 object-cover rounded-md bg-gray-100"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800">{booking.travel_package.accomodation.name}</p>
                                        <p className="text-sm text-gray-600">{booking.travel_package.accomodation.address}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
                                Accommodation is not included in this package.
                            </div>
                        )}
                    </div>


                    {/* --- Included Vehicles Section (Dynamic) --- */}
                    {booking.booking_vehicles && booking.booking_vehicles.length > 0 && (
                        <div className="pt-6 border-t">
                            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                <Car className="w-5 h-5 text-blue-500" />
                                Included Vehicle(s)
                            </h4>
                            <motion.ul className="space-y-4" variants={listContainerVariants} initial="hidden" animate="visible">
                                {booking.booking_vehicles.map(({ vehicle }) => (
                                    <motion.li key={vehicle.id} variants={listItemVariants}>
                                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                                            <img src={vehicle.image_url[0]} alt={vehicle.name} className="w-24 h-16 object-cover rounded-md bg-gray-100"/>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800">{vehicle.brand} {vehicle.name}</p>
                                                <p className="text-xs text-gray-500 capitalize">{vehicle.type.replace("_", " ")}</p>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </div>
                    )}
                    
                    {/* --- Additional Notes Section (Dynamic) --- */}
                    {booking.notes && (
                        <div className="pt-6 border-t">
                            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5 text-blue-500" />
                                Additional Notes
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none">
                                <p>{booking.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}