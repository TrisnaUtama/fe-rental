"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { cn } from "@/lib/utils";
import React from "react";

export type Crumb = {
  title: string;
  href?: string;
  icon?: React.ReactNode;
};

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  if (!items || items.length === 0) return null;

  return (
    <Breadcrumb className={cn("text-sm", className)}>
      <BreadcrumbList>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink
                    href={item.href}
                    className="flex items-center gap-1"
                  >
                    {item.icon}
                    {item.title}
                  </BreadcrumbLink>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    {item.icon}
                    {item.title}
                  </span>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
