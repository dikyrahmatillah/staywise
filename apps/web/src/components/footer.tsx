"use client";

import { HiHome, HiOutlineMail } from "react-icons/hi";
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from "react-icons/fi";
import { Button } from "@/components/ui/button";

interface FooterLinkProps {
  title: string;
  links: { name: string; href: string }[];
}

const FooterLinkSection = ({ title, links }: FooterLinkProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="font-semibold text-base mb-1">{title}</h3>
      {links.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          size="sm"
          className="justify-start px-0 text-gray-600 hover:text-gray-900 h-auto py-1"
          disabled
        >
          {link.name}
        </Button>
      ))}
    </div>
  );
};

export function Footer() {
  const supportLinks = [
    { name: "Help Center", href: "#" },
    { name: "AirCover for Guests", href: "#" },
    { name: "Anti-discrimination", href: "#" },
    { name: "Disability support", href: "#" },
    { name: "Cancellation options", href: "#" },
  ];

  const hostingLinks = [
    { name: "Become a Host", href: "#" },
    { name: "AirCover for Hosts", href: "#" },
    { name: "Hosting resources", href: "#" },
    { name: "Community forum", href: "#" },
    { name: "Hosting responsibly", href: "#" },
  ];

  const stayWiseLinks = [
    { name: "Newsroom", href: "#" },
    { name: "New features", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Investors", href: "#" },
    { name: "Gift cards", href: "#" },
  ];

  const legalLinks = [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Sitemap", href: "#" },
    { name: "Destinations", href: "#" },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto max-w-screen-2xl px-6 pt-10 pb-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-8">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
              <HiHome className="h-6 w-6 font-sans text-rose-500" />
              <span className="font-bold text-lg text-rose-500">StayWise</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Find your perfect stay, anywhere in the world.
            </p>
            <div className="flex space-x-4 text-gray-600 mt-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:text-rose-500"
                disabled
              >
                <FiInstagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:text-rose-500"
                disabled
              >
                <FiFacebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:text-rose-500"
                disabled
              >
                <FiTwitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:text-rose-500"
                disabled
              >
                <FiYoutube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <FooterLinkSection title="Support" links={supportLinks} />
          <FooterLinkSection title="Hosting" links={hostingLinks} />
          <FooterLinkSection title="StayWise" links={stayWiseLinks} />
          <FooterLinkSection title="Legal" links={legalLinks} />
        </div>

        <div className="border-t border-gray-200 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
            <span>© 2025 StayWise, Inc.</span>
            <span className="hidden md:inline mx-2">·</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 px-0 h-auto"
              disabled
            >
              Privacy
            </Button>
            <span className="hidden md:inline mx-2">·</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 px-0 h-auto"
              disabled
            >
              Terms
            </Button>
            <span className="hidden md:inline mx-2">·</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 px-0 h-auto"
              disabled
            >
              Sitemap
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <HiOutlineMail className="h-4 w-4 mr-2" />
              <span className="font-medium">support@staywise.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
