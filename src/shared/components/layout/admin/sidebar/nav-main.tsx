import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { Link } from "react-router-dom";

export function NavMain({
  items,
  activePath,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
  activePath: string;
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = item.url === activePath;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
                  ${
                    isActive
                      ? "bg-black text-white hover:bg-black hover:text-white"
                      : "text-black hover:bg-gray-100"
                  }
                `}
              >
                <Link to={item.url} className="flex items-center gap-2 w-full">
                  <item.icon
                    className={`h-4 w-4 transition-colors duration-200 ${
                      isActive ? "text-white" : "text-black"
                    }`}
                  />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
