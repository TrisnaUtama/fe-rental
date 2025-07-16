import { CheckCircle, FileDigit, ScanLine, Car } from "lucide-react";
import type { BookingResponse } from "../../../types/booking.type";
import { format } from "date-fns";

const formatRupiah = (value: string | number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));

const getDayDifference = (start: string, end: string) => {
  if (!start || !end) return 1;
  const diffTime = Math.abs(
    new Date(end).getTime() - new Date(start).getTime()
  );
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24) + 1) || 1;
};

const SummaryRow = ({ label, value, isDiscount = false }: { label: string; value: string; isDiscount?: boolean; }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
    <span className={`font-semibold ${isDiscount ? 'text-green-600' : 'text-gray-800'}`}>
      {value}
    </span>
  </div>
);

export const InvoiceReceipt = ({ booking }: { booking: BookingResponse }) => {
  const payment = booking.Payments?.[0];
  const days = getDayDifference(booking.start_date, booking.end_date!);

  const subtotal = booking.booking_vehicles!.reduce((sum, { vehicle }) => sum + Number(vehicle.price_per_day), 0) * days;
  const discountAmount = booking.promos ? subtotal - Number(booking.total_price) : 0;

  if (!payment) return null;

  return (
    <div id="invoice-section">
      <div className="flex items-center gap-3 mb-4">
        <FileDigit className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-800">Your Invoice</h3>
      </div>
      <div className="bg-white p-8 rounded-2xl border relative overflow-hidden">
        <CheckCircle className="absolute -bottom-16 -right-16 text-gray-100/50 w-52 h-52 -rotate-12" />
        <div className="flex justify-between items-start pb-6 border-b-2 border-gray-100">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Bintang Transport Services</h3>
                <p className="text-sm text-gray-500">
                  Rental & Travel Services
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              INVOICE
            </h2>
            <p className="text-gray-500 font-mono text-sm">#{booking.id}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 py-6">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-2">
              BILLED TO
            </p>
            <p className="font-medium text-gray-800">{booking.users!.name}</p>
            <p className="text-gray-600">{booking.users!.email}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 font-semibold mb-1">
              Date of Issue
            </p>
            <p className="font-medium text-gray-800">
              {payment.payment_date
                ? format(new Date(payment.payment_date), "dd MMMM yyyy")
                : "N/A"}
            </p>
            <p className="text-sm text-gray-500 font-semibold mt-2 mb-1">
              Status
            </p>
            <p className="font-bold text-green-600">PAID</p>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-sm font-semibold text-gray-600 rounded-l-lg">
                DESCRIPTION
              </th>
              <th className="p-3 text-sm font-semibold text-gray-600 text-center">
                QTY
              </th>
              <th className="p-3 text-sm font-semibold text-gray-600 text-right">
                UNIT PRICE
              </th>
              <th className="p-3 text-sm font-semibold text-gray-600 text-right rounded-r-lg">
                AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            {booking.booking_vehicles!.map(({ vehicle }) => (
              <tr key={vehicle.id} className="border-b">
                <td className="p-3 pt-4 font-medium text-gray-800">
                  {vehicle.brand} {vehicle.name}
                </td>
                <td className="p-3 pt-4 text-gray-600 text-center">
                  {days} day(s)
                </td>
                <td className="p-3 pt-4 text-gray-600 text-right">
                  {formatRupiah(vehicle.price_per_day)}
                </td>
                <td className="p-3 pt-4 text-gray-800 font-semibold text-right">
                  {formatRupiah(Number(vehicle.price_per_day) * days)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <div className="w-full max-w-sm space-y-3">
            <SummaryRow
              label="Subtotal"
              value={formatRupiah(subtotal)}
            />
            
            {booking.promos && (
              <SummaryRow
                label={`Discount (${booking.promos.code})`}
                value={`-${formatRupiah(discountAmount)}`}
                isDiscount={true}
              />
            )}
            
            <div className="border-t-2 border-dashed pt-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-lg">Total Paid</span>
                <span className="font-bold text-xl text-gray-900">
                  {formatRupiah(payment.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-6 mt-6">
          <span>Thank you for choosing us!</span>
          <ScanLine className="w-10 h-10 text-gray-400" />
        </div>
      </div>
    </div>
  );
};