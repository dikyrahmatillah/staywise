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
    // Prefer canonical/current URL. In Next.js client components `location` is available.
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
      toast("Unable to copy automatically");
    }
  }, [getShareUrl]);

  return (
    <div className="py-4 mb-2">
      <div className="flex items-center mb-2">
        <Link href="/properties">
          <Button
            variant="ghost"
            size="sm"
            className="group flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to listings
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
            {name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-slate-50 transition-colors flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span className="font-medium">Share</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={copyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openSocial("twitter")}>
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openSocial("facebook")}>
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openSocial("whatsapp")}>
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
