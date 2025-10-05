"use client";

import { Button } from "@/components/ui/button";
import {
  Share2,
  ArrowLeft,
  Twitter,
  Facebook,
  MessageSquare,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { useCallback } from "react";

export function HeaderBlock({ name }: { name: string }) {
  const getShareUrl = useCallback(() => {
    try {
      return window.location.href;
    } catch {
      return "";
    }
  }, []);

  const openSocial = useCallback(
    (platform: "twitter" | "facebook" | "whatsapp") => {
      const url = encodeURIComponent(getShareUrl());
      const text = encodeURIComponent(name || "");
      let shareLink = "";
      if (platform === "twitter") {
        shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      } else if (platform === "facebook") {
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      } else if (platform === "whatsapp") {
        shareLink = `https://wa.me/?text=${text}%20${url}`;
      }
      window.open(shareLink, "_blank", "noopener,noreferrer");
    },
    [getShareUrl, name]
  );

  const copyLink = useCallback(async () => {
    const shareUrl = getShareUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    } catch (err: unknown) {
      console.debug("clipboard write failed", err);
      toast.error("Unable to copy automatically");
    }
  }, [getShareUrl]);

  return (
    <div className="py-4 mb-2">
      <div className="flex items-center mb-6">
        <Link href="/properties">
          <Button
            variant="ghost"
            size="sm"
            className="group flex items-center text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-slate-50 rounded-full px-3 py-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to listings</span>
          </Button>
        </Link>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight  leading-tight">
            {name}
          </h1>
        </div>
        <div className="flex items-center justify-end gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-slate-50 transition-colors flex items-center  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-400 focus-visible:border-primary"
              >
                <Share2 className="h-4 w-4 mr-2 text-slate-600" />
                <span className="font-medium text-slate-700">Share</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 shadow-lg border-slate-200 rounded-xl"
            >
              <DropdownMenuItem
                onClick={copyLink}
                className="rounded-lg mx-1 my-1"
              >
                <Copy className="h-4 w-4 mr-3 text-slate-600" />
                <span className="font-medium">Copy Link</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem
                onClick={() => openSocial("twitter")}
                className="rounded-lg mx-1 my-1"
              >
                <Twitter className="h-4 w-4 mr-3 text-sky-500" />
                <span className="font-medium">Twitter</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openSocial("facebook")}
                className="rounded-lg mx-1 my-1"
              >
                <Facebook className="h-4 w-4 mr-3 text-blue-600" />
                <span className="font-medium">Facebook</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openSocial("whatsapp")}
                className="rounded-lg mx-1 my-1"
              >
                <MessageSquare className="h-4 w-4 mr-3 text-green-600" />
                <span className="font-medium">WhatsApp</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
