import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function CartDrawer({ isOpen, onClose, children }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold">Your Booking Summary</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X /></button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}