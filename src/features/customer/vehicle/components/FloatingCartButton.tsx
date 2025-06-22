import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface FloatingCartButtonProps {
    cartCount: number;
    onClick: () => void;
}
export function FloatingCartButton({ cartCount, onClick }: FloatingCartButtonProps) {
    return (
        <AnimatePresence>
            {cartCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 50 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="fixed bottom-6 right-6 z-30"
                >
                    <Button 
                        onClick={onClick}
                        size="lg"
                        className="rounded-full shadow-lg h-16 w-16 bg-blue-600 hover:bg-blue-700 relative flex items-center justify-center"
                        aria-label={`View cart with ${cartCount} items`}
                    >
                        <ShoppingCart className="h-7 w-7 text-white" />
                        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white border-2 border-white">
                            {cartCount}
                        </span>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
