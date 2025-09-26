"use client";

import React, { useState } from "react";
import { LayoutDashboard, ReceiptText, UserCog } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/dashboard/sidebar";

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
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard/guest" },
  {
    label: "Booking History",
    icon: ReceiptText,
    href: "/dashboard/guest/bookings",
  },
  {
    label: "Profile & Account",
    icon: UserCog,
    href: "/dashboard/guest/account",
  },
];

import GroupItem from "@/components/dashboard/group-item";

export function GuestSidebar({ isSheet }: { isSheet?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar
      collapsed={collapsed}
      onToggle={() => setCollapsed((s) => !s)}
      isSheet={isSheet}
      title="Guest Dashboard"
    >
      <ul className="space-y-1">
        {nav.map((group, idx) => (
          <React.Fragment key={group.label}>
            <GroupItem group={group} collapsed={collapsed} />
            {idx === 0 || idx === 2 ? <Separator className="my-1" /> : null}
          </React.Fragment>
        ))}
      </ul>
    </Sidebar>
  );
}
