"use client";

import React from "react";
import {
  LayoutDashboard,
  Building2,
  ReceiptText,
  BarChart3,
  UserCog,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

type Item = {
  label: string;
  href: string;
};

type Group = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: Item[];
  href?: string;
};

const nav: Group[] = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard/tenant" },
  {
    label: "Property Managements",
    icon: Building2,
    items: [
      { label: "List Property", href: "/dashboard/tenant/properties" },
      { label: "Add Property", href: "/dashboard/tenant/properties/add" },
      {
        label: "Property Categories",
        href: "/dashboard/tenant/properties/categories",
      },
    ],
  },

  {
    label: "Transactions",
    icon: ReceiptText,
    href: "/dashboard/tenant/transactions",
  },
  {
    label: "Reports",
    icon: BarChart3,
    items: [
      { label: "Sales Reports", href: "/dashboard/tenant/reports/sales" },
      {
        label: "Property Reports",
        href: "/dashboard/tenant/reports/properties",
      },
    ],
  },
  { label: "Reviews", icon: Star, href: "/dashboard/tenant/reviews" },
  {
    label: "Profile & Account",
    icon: UserCog,
    href: "/dashboard/tenant/account",
  },
];

import GroupItem from "@/components/dashboard/group-item";
import Sidebar from "@/components/dashboard/sidebar";

export function TenantSidebar({ isSheet }: { isSheet?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar
      collapsed={collapsed}
      onToggle={() => setCollapsed((s) => !s)}
      isSheet={isSheet}
      title="Tenant Dashboard"
    >
      <ul className="space-y-1">
        {nav.map((g, idx) => (
          <React.Fragment key={g.label}>
            <GroupItem group={g} collapsed={collapsed} />
            {idx === 0 || idx === 2 || idx === 5 ? (
              <Separator className="my-1" />
            ) : null}
          </React.Fragment>
        ))}
      </ul>
    </Sidebar>
  );
}
