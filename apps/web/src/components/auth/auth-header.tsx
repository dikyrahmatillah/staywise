"use client";

import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  caption: string;
  link?: string;
  linkWord?: string;
};

export default function AuthHeader({ title, link, caption, linkWord }: Props) {
  return (
    <div className="text-center space-y-2">
      <h1 className="font-display text-3xl font-bold text-foreground ">
        {title}
      </h1>
      <p className="text-muted-foreground">
        {caption}{" "}
        {link && (
          <Link
            href={link}
            className="text-primary hover:underline font-medium"
          >
            {linkWord}
          </Link>
        )}
      </p>
    </div>
  );
}
