import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";
import { Button } from "@/shared/components/ui/button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * A responsive drawer component that slides in from the right.
 * It provides a backdrop, animation, and a header with a title and close button.
 * It's designed to contain the CartSummary component.
 */
export function CartDrawer({ isOpen, onClose, children }: CartDrawerProps) {
  // Effect to lock body scroll when the drawer is open.
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to reset scroll behavior.
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            aria-hidden="true"
          />
          
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-gray-50 z-50 shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
          >
            {/* Drawer Header */}
            <header className="p-4 border-b flex items-center justify-between flex-shrink-0 bg-white">
              <h2 id="cart-drawer-title" className="text-xl font-bold text-gray-900">
                Your Rental Summary
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="rounded-full"
                aria-label="Close cart summary"
              >
                <X className="w-5 h-5" />
              </Button>
            </header>
            
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
