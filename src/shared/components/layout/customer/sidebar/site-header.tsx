import { useEffect, useState } from "react";
import { Menu, Heart, User2 } from "lucide-react";
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
import { toast } from "sonner";

function UserDropdown() {
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    logout(); 
    toast.success("Success", {
      description: "Successfully logout"
    })
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer w-8 h-8">
          <AvatarImage src="a.jpg" alt="User avatar" />
          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{user?.name || "User"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/list-booking-vehicle">Vehicle Bookings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/list-booking-travel">Travel Bookings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const { toggle } = useSidebar();
  const [scrolled, setScrolled] = useState(false);
  const { accessToken, user } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-40 h-20 flex items-center justify-between px-4 text-black transition-shadow duration-300",
        {
          "bg-white shadow border-b border-gray-200": scrolled,
          "bg-transparent": !scrolled,
        }
      )}
    >
      <div className="flex items-center space-x-4">
        <button className="p-2" onClick={toggle}>
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex space-x-1">
          {["B", "B", "T"].map((char, index) => (
            <div
              key={index}
              className="w-6 h-6 bg-blue-500 text-white font-bold text-sm flex items-center justify-center rounded"
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Heart className="w-5 h-5" />
        {accessToken && user ? (
          <UserDropdown />
        ) : (
          <Link
            to="/"
            className="flex items-center border px-3 py-1 rounded-md hover:bg-blue-500 hover:text-white"
          >
            <User2 className="w-4 h-4 mr-2" />
            <span className="text-sm">Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
}
