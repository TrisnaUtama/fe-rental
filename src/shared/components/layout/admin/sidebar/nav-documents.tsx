import { useState } from "react";
import { type LucideIcon, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/shared/components/ui/sidebar";

interface SubItem {
  title: string;
  url: string;
}

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  subItems?: SubItem[];
}

interface NavDocumentsProps {
  items: NavItem[];
}

const containerVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.3 },
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3 },
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 10,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};


export function NavDocuments({ items }: NavDocumentsProps) {
  const location = useLocation();
  const activePath = location.pathname;

  const [openDropdown, setOpenDropdown] = useState<string | null>(() => {
    const activeParent = items.find(item => item.subItems && activePath.startsWith(item.url));
    return activeParent ? activeParent.url : null;
  });

  const toggleDropdown = (url: string) => {
    setOpenDropdown(prev => (prev === url ? null : url));
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Operationals</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isParentActive = hasSubItems && activePath.startsWith(item.url);
          const isOpen = openDropdown === item.url;

          if (hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => toggleDropdown(item.url)}
                  className={`group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 w-full
                    ${isParentActive ? "bg-black text-white hover:bg-black hover:text-white" : "text-black hover:bg-gray-100"}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className={`h-4 w-4 transition-colors duration-200 ${isParentActive ? "text-white" : "text-black"}`} />
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </SidebarMenuButton>

                <AnimatePresence>
                  {isOpen && (
                    <motion.ul
                      key="sub-menu"
                      variants={containerVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="space-y-1 pl-5 overflow-hidden"
                    >
                      {item.subItems!.map((subItem) => {
                        const isSubItemActive = activePath === subItem.url;
                        return (
                          <motion.li key={subItem.url} variants={itemVariants}>
                            <Link
                              to={subItem.url}
                              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors
                                ${isSubItemActive ? "bg-gray-100 text-black font-semibold" : "text-gray-600 hover:bg-gray-100 hover:text-black"}
                              `}
                            >
                              {subItem.title}
                            </Link>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </SidebarMenuItem>
            );
          } else {
            const isActive = activePath === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
                    ${isActive ? "bg-black text-white hover:bg-black hover:text-white" : "text-black hover:bg-gray-100"}
                  `}
                >
                  <Link to={item.url} className="flex items-center gap-2 w-full">
                    <item.icon className={`h-4 w-4 transition-colors duration-200 ${isActive ? "text-white" : "text-black"}`} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
