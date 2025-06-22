import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/shared/context/authContex";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { setConfirmCallback } from "@/lib/confirmDialogCallback";
import { openDialog } from "@/store/slice/confiramtionDialog";
import { useDispatch } from "react-redux";

function UserDropdown() {
  const { user, logout } = useAuthContext();
  const dispatch = useDispatch();

  const handleLogoutClick = () => {
      setConfirmCallback(handleLogout);
      dispatch(
        openDialog({
          title: "Logout Confirmation",
          description: "Are you sure you want to logout?",
        })
      );
    }

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
  };

  return (
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Avatar className="w-9 h-9">
                <AvatarImage src={"a.jpg"} alt="User avatar" />
                <AvatarFallback>{user?.name?.[0].toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuLabel>
            <p className="font-bold">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500 font-normal">{user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/list-booking-vehicle">Vehicle Bookings</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/list-booking-travel">Travel Bookings</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogoutClick} className="text-red-600 focus:bg-red-50 focus:text-red-600">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function SiteHeader() {
  const { toggle } = useSidebar();
  const [scrolled, setScrolled] = useState(false);
  const { accessToken, user } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={clsx(
        "fixed top-0 left-0 right-0 z-30 h-20 transition-all duration-300",
        scrolled
          ? "bg-white/80 shadow-md backdrop-blur-sm border-b"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} className={clsx("rounded-full lg:hidden", scrolled ? "text-gray-800 hover:bg-gray-200" : "text-white hover:bg-white/10")}>
            <Menu className="w-5 h-5" />
          </Button>
           <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-lg font-mono">B</div>
              <span className={clsx(scrolled ? "text-gray-900" : "text-white")}>BaliRent</span>
            </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {accessToken && user ? (
            <UserDropdown />
          ) : (
            <Button asChild className="rounded-full hidden sm:flex">
              <Link to="/">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}

