import { useCart } from "@/shared/context/cartContext";
import { toast } from "sonner";
import { useAuthContext } from "@/shared/context/authContex";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, X, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export default function CartSummary() {
  const { cart, clearCart, removeVehicle } = useCart();
  const { accessToken } = useAuthContext();
  const navigate = useNavigate();

  const calculateDays = (from: Date, to: Date) => {
    if (!from || !to) return 1;
    const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const getItemTotal = (item: (typeof cart)[0]) => {
    const days = calculateDays(item.dateRange.from!, item.dateRange.to!);
    return days * Number(item.vehicle.price_per_day);
  };

  const totalPrice = cart.reduce((acc, item) => acc + getItemTotal(item), 0);

  // Handles the booking process, redirecting to login if not authenticated.
  const handleBookingNow = () => {
    if (!accessToken) {
      navigate("/sign-up");
      toast.warning("Please sign in to continue", {
        description: "You need an account to complete your booking.",
        position: "top-center",
      });
    } else {
      navigate("/booking-vehicle");
    }
  };
  
  // Renders a message when the cart is empty.
  if (!cart.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-300" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Your cart is empty</h3>
        <p className="text-gray-500 mt-2 max-w-xs">
          Looks like you haven't added any vehicles yet. Let's find one!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">

        {/* Cart Items List */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.map(({ vehicle, dateRange }) => {
            const days = calculateDays(dateRange.from!, dateRange.to!);
            const itemTotal = getItemTotal({ vehicle, dateRange });

            return (
                <div key={vehicle.id} className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
                    <img 
                        src={vehicle.image_url[0] || '/placeholder.svg'} 
                        alt={vehicle.name} 
                        className="w-24 h-20 sm:w-28 sm:h-24 object-cover rounded-lg bg-gray-100" 
                    />
                    <div className="flex-1">
                        <p className="font-bold text-base text-gray-800">{vehicle.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {days} day{days > 1 ? "s" : ""} &times; {currencyFormatter.format(Number(vehicle.price_per_day))}
                        </p>
                        <p className="font-semibold text-blue-600 mt-2">
                            {currencyFormatter.format(itemTotal)}
                        </p>
                    </div>
                    <Button 
                        onClick={() => removeVehicle(vehicle.id)} 
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:bg-red-50 hover:text-red-500 w-8 h-8"
                        aria-label="Remove item"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            );
            })}
        </div>

        <div className="p-4 sm:p-6 border-t bg-white/80 backdrop-blur-sm mt-auto space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-800">Total</span>
                <span className="text-blue-600">{currencyFormatter.format(totalPrice)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button onClick={clearCart} variant="outline" size="lg">
                    <Trash2 className="w-4 h-4 mr-2 hidden sm:inline-block"/>
                    Clear
                </Button>
                <Button onClick={handleBookingNow} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                    Book Now
                </Button>
            </div>
        </div>
    </div>
  );
}
