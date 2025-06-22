import { CheckCircle, FileDigit, ScanLine, Map, Calendar, Mail,  Home, CreditCard } from "lucide-react";
import type { BookingResponse } from "../../../types/booking.type";
import { format } from "date-fns";
import React from "react";

const formatRupiah = (value: string | number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value));

const SummaryRow = ({ label, value, isDiscount = false, isTotal = false }: { label: string; value: string; isDiscount?: boolean; isTotal?: boolean; }) => (
    <div className={`flex justify-between items-baseline ${isTotal ? 'text-lg' : 'text-sm'}`}>
      <span className={`font-semibold ${isTotal ? 'text-gray-900' : 'text-gray-500'}`}>{label}</span>
      <span className={`font-bold ${isDiscount ? 'text-green-600' : isTotal ? 'text-blue-600 text-xl' : 'text-gray-800'}`}>
        {value}
      </span>
    </div>
);

const InfoItem = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
    <div className="flex items-center gap-2 text-xs text-gray-500">
        <Icon className="w-3 h-3"/>
        <span>{text}</span>
    </div>
);


export const InvoiceReceiptTravel = ({ booking }: { booking: BookingResponse }) => {
    const payment = booking.Payments?.[0];
    const subtotal = Number(booking.pax_option?.price || 0);
    const discountAmount = booking.promos ? subtotal - Number(booking.total_price) : 0;
    if (!payment) return null;

    return (
        <div id="invoice-section">
            <div className="flex items-center gap-3 mb-4">
                <FileDigit className="w-5 h-5 text-blue-500"/>
                <h3 className="text-lg font-semibold text-gray-800">Your Invoice</h3>
            </div>
            <div className="bg-white p-8 rounded-2xl border relative overflow-hidden">
                <CheckCircle className="absolute -bottom-16 -right-16 text-gray-100/50 w-52 h-52 -rotate-12" />
                
                <div className="flex justify-between items-start pb-6 border-b-2 border-gray-100">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <Map className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Bintang Transport Services</h3>
                                <p className="text-sm text-gray-500">Travel & Tour Services</p>
                                <div className="mt-2 space-y-1">
                                    <InfoItem icon={Home} text="Jl. Raya Kuta No. 1, Bali, Indonesia" />
                                    <InfoItem icon={Mail} text="contact@bintangtransport.com" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">INVOICE</h2>
                        <p className="text-gray-500 font-mono text-sm">#{booking.id}</p>
                    </div>
                </div>

                {/* --- BILLED TO & PAYMENT DETAILS SECTION --- */}
                <div className="grid grid-cols-2 gap-8 py-6">
                    <div>
                        <p className="text-sm text-gray-500 font-semibold mb-2">BILLED TO</p>
                        <p className="font-medium text-gray-800">{booking.users!.name}</p>
                        <p className="text-gray-600">{booking.users!.email}</p>
                    </div>
                    <div className="text-right space-y-2">
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Date of Issue</p>
                            <p className="font-medium text-gray-800">{payment.payment_date ? format(new Date(payment.payment_date), "dd MMMM yyyy") : 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Payment Method</p>
                            <p className="font-medium text-gray-800 capitalize flex items-center justify-end gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400"/>
                                {payment.payment_method?.replace(/_/g, " ") || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-b py-4 my-4">
                     <h4 className="text-sm font-semibold text-gray-500 mb-3">BOOKING DETAILS</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500"/>
                            <div>
                                <p className="text-xs text-gray-500">Departure</p>
                                <p className="font-medium text-gray-800">{format(new Date(booking.start_date), "dd MMMM yyyy")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500"/>
                             <div>
                                <p className="text-xs text-gray-500">Return</p>
                                <p className="font-medium text-gray-800">{format(new Date(booking.end_date!), "dd MMMM yyyy")}</p>
                            </div>
                        </div>
                     </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-3">ORDER SUMMARY</h4>
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800">{booking.travel_package?.name}</p>
                                <p className="text-sm text-gray-600">{booking.pax_option?.pax} Pax Option</p>
                            </div>
                            <p className="font-semibold text-gray-800">{formatRupiah(subtotal)}</p>
                        </div>

                        <div className="flex justify-end">
                            <div className="w-full max-w-sm space-y-3 pt-4">
                                <SummaryRow label="Subtotal" value={formatRupiah(subtotal)} />
                                {booking.promos && (
                                    <SummaryRow
                                        label={`Discount (${booking.promos.code})`}
                                        value={`-${formatRupiah(discountAmount)}`}
                                        isDiscount={true}
                                    />
                                )}
                                <div className="border-t pt-3 mt-2">
                                     <SummaryRow label="Total Paid" value={formatRupiah(payment.total_amount)} isTotal={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-6 mt-8">
                    <span>Thank you for your business!</span>
                    <ScanLine className="w-10 h-10 text-gray-400" />
                </div>
            </div>
        </div>
    );
};