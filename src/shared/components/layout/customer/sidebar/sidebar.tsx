import { CarFront, Plane } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { isOpen, close } = useSidebar();

  const navItems = [
    { label: "Trips", icon: <Plane className="w-4 h-4" />, path: "/trips" },
    { label: "Car Rental", icon: <CarFront className="w-4 h-4" />, path: "/car-rental" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-30 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ top: "3.5rem" }}
        onClick={close}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-gray-50 text-black z-50 transition-all duration-300",
          isOpen ? "w-52" : "w-0 overflow-hidden"
        )}
      >
        <nav className="flex flex-col p-2 space-y-2 mt-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className="flex items-center text-sm px-3 py-2 space-x-6 rounded-md hover:bg-gray-100"
            >
              {item.icon}
              <span className="font-light">{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
