import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";

export const MenuBar = ({ menuBar }: { menuBar: { path: string; icon: React.ReactNode; label: string }[] }) => {
  const { pathname } = useLocation();

  return (
    // Added flex-wrap and justify-center for better responsiveness on small screens
    <div className="flex flex-wrap items-center justify-center gap-4 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
      {menuBar.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`relative px-3 sm:px-4 py-2 text-sm font-semibold rounded-full transition-colors ${isActive ? 'text-white' : 'text-white/80 hover:text-white'}`}
          >
            <span className="relative z-10 flex items-center gap-2">
                {item.icon} {item.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="active-menu-pill"
                className="absolute inset-0 bg-blue-600 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};