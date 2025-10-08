"use client";

import React from "react";
import { Button } from "./button";

type Props = React.ComponentProps<typeof Button> & {
  children: React.ReactNode;
};

export default function PrimaryButton({
  children,
  className,
  ...props
}: Props) {
  return (
    <Button variant="default" className={className} {...props}>
      {children}
    </Button>
  );
}
