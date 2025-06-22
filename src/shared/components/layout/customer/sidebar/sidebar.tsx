import { useSidebar } from "./sidebar-context";
import { useLocation, Link } from "react-router-dom";
import { CarFront, Map, Palmtree, LogOut, X } from "lucide-react";
import { useAuthContext } from "@/shared/context/authContex";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { toast } from "sonner";

const navItems = [
  { label: "Trips", icon: Map, path: "/travel" },
  { label: "Car Rental", icon: CarFront, path: "/car-rental" },
  { label: "Destinations", icon: Palmtree, path: "/destination" },
];

const sidebarVariants: Variants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const navListVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.2,
        }
    }
}

const navItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
}

export function AppSidebar() {
  const { isOpen, close } = useSidebar();
  const { user, logout } = useAuthContext();
  const location = useLocation();
  
  const handleLogout = () => {
    close();
    logout(); 
    toast.success("Success", { description: "Successfully logged out" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={close}
          />
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 h-full w-72 bg-white text-black z-50 shadow-2xl lg:hidden"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b h-20">
                <Link to="/" onClick={close} className="flex items-center gap-2 text-xl font-bold">
                  <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-lg font-mono">B</div>
                  <span>BaliRent</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={close} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {user && (
                 <div className="p-4 border-b">
                    <Link to="/profile" onClick={close} className="flex items-center gap-3 group">
                        <Avatar><AvatarImage src={"a.jpg"} /><AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback></Avatar>
                        <div>
                            <p className="font-semibold group-hover:text-blue-600 transition-colors">{user.name}</p>
                            <p className="text-xs text-gray-500">View Profile</p>
                        </div>
                    </Link>
                 </div>
              )}
             
              <motion.nav 
                className="flex-grow p-4 space-y-2"
                variants={navListVariants}
                initial="hidden"
                animate="visible"
              >
                {navItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <motion.div key={item.label} variants={navItemVariants}>
                      <Link
                        to={item.path}
                        onClick={close}
                        className={`relative flex items-center text-base px-4 py-3 gap-4 rounded-lg transition-colors ${isActive ? "text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        {isActive && (
                            <motion.div 
                                layoutId="active-sidebar-pill"
                                className="absolute inset-0 bg-blue-100 rounded-lg z-0"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10"><item.icon className="w-5 h-5" /></span>
                        <span className="relative z-10 font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              {user && (
                <div className="p-4 mt-auto border-t">
                  <Button variant="ghost" className="w-full justify-start gap-4 text-red-600 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="w-5 h-5" />
                    <span className="font-semibold">Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}