import { ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function FloatingCartButton({ cartCount, onClick }: { cartCount: number; onClick: () => void; }) {
  return (
    <button onClick={onClick} className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full shadow-2xl h-16 w-16 flex items-center justify-center z-30 hover:bg-blue-700 transition-colors">
      <ShoppingCart className="w-7 h-7" />
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.span
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white"
          >
            {cartCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}