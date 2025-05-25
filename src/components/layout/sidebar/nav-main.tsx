import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
  activePath,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
  activePath: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          {items.map((item) => {
            const isActive = activePath === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200 mt-0.5 cursor-pointer
                    ${
                      isActive
                        ? "bg-black text-white hover:bg-black hover:text-white"
                        : "text-black hover:bg-gray-100 hover:text-black"
                    }
                  `}
                >
                  {item.icon && (
                    <item.icon
                      className={`h-4 w-4 transition-colors duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-black group-hover:text-black"
                      }`}
                    />
                  )}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
