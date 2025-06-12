// src/pages/customer/booking/CardSumary.tsx
import { useCart } from "@/shared/context/cartContext";
import { toast } from "sonner";
import { useAuthContext } from "@/shared/context/authContex";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function CartSummary() {
  const { cart, clearCart, removeVehicle } = useCart();
  const { accessToken } = useAuthContext();
  const navigate = useNavigate();

  const calculateDays = (from: Date, to: Date) => Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) || 1;
  const getItemTotal = (item: (typeof cart)[0]) => calculateDays(item.dateRange.from!, item.dateRange.to!) * Number(item.vehicle.price_per_day);
  const totalPrice = cart.reduce((acc, item) => acc + getItemTotal(item), 0);

  const handleBookingNow = () => {
    if (!accessToken) {
      navigate("/sign-up");
      toast.warning("Please sign in to continue", { description: "You need an account to complete your booking." });
    } else {
      navigate("/booking-vehicle");
    }
  };

  if (!cart.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
        <ShoppingCart className="w-16 h-16 mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-700">Your cart is empty</h3>
        <p className="text-sm mt-1">Add a vehicle to get started on your next adventure!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {cart.map(({ vehicle, dateRange }) => {
            const days = calculateDays(dateRange.from!, dateRange.to!);
            const itemTotal = getItemTotal({ vehicle, dateRange });

            return (
                <div key={vehicle.id} className="flex items-start gap-4 text-sm">
                    <img src={vehicle.image_url[0]} alt={vehicle.name} className="w-20 h-16 object-cover rounded-md bg-gray-100" />
                    <div className="flex-1">
                        <p className="font-bold text-gray-800">{vehicle.name}</p>
                        <p className="text-xs text-gray-500">{days} day{days > 1 ? "s" : ""} at Rp {Number(vehicle.price_per_day).toLocaleString("id-ID")}</p>
                        <p className="font-semibold mt-1">Rp {itemTotal.toLocaleString("id-ID")}</p>
                    </div>
                    <button onClick={() => removeVehicle(vehicle.id)} className="p-1 text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            );
            })}
        </div>

        {/* Footer with Summary & Actions */}
        <div className="p-6 border-t bg-white mt-auto space-y-4">
            <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>

            <div className="flex flex-col gap-2">
                <Button onClick={handleBookingNow} size="lg" className="w-full">
                    Proceed to Booking
                </Button>
                <Button onClick={clearCart} variant="outline" className="w-full">
                    Clear Cart
                </Button>
            </div>
        </div>
    </div>
  );
}