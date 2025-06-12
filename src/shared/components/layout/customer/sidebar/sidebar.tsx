import { CarFront, Map, Palmtree, BotMessageSquareIcon } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

export function AppSidebar() {
  const { isOpen, close } = useSidebar();
  const location = useLocation();

  const navItems = [
    { label: "Trips", icon: <Map className="w-4 h-4" />, path: "/travel" },
    { label: "Car Rental", icon: <CarFront className="w-4 h-4" />, path: "/car-rental" },
    { label: "Destinations", icon: <Palmtree className="w-4 h-4" />, path: "/destination" },
    { label: "AI", icon: <BotMessageSquareIcon className="w-4 h-4" />, path: "/ai" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-30 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ top: "5rem" }}
        onClick={close}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-[4.5rem] left-0 h-[calc(100vh-4.5rem)] bg-white text-black z-50 transition-all duration-300",
          isOpen ? "w-52" : "w-0 overflow-hidden"
        )}
      >
        <nav className="flex flex-col p-2 space-y-2 mt-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={close}
                className={cn(
                  "flex items-center text-sm px-3 py-2 space-x-6 rounded-md transition-all",
                  isActive
                    ? "bg-gray-100 text-black font-semibold"
                    : "hover:bg-gray-100"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
