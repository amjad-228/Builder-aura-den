import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Users, UserPlus, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-violet-50 to-blue-50 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-3">
        <Link to="/" className="flex items-center gap-1.5">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-indigo-600"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </motion.div>
          <span className="text-lg font-bold text-indigo-600">
            شجرة العائلة
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="space-x-3">
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    )}
                  >
                    <Home className="mr-1.5 h-4 w-4" />
                    الرئيسية
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/family-tree">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    )}
                  >
                    <Users className="mr-1.5 h-4 w-4" />
                    شجرة العائلة
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/add-member">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    )}
                  >
                    <UserPlus className="mr-1.5 h-4 w-4" />
                    إضافة فرد
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 md:hidden"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden"
        >
          <div className="container mx-auto flex flex-col space-y-2 px-3 py-3">
            <Link
              to="/"
              className="flex items-center rounded-md px-4 py-3 text-base font-medium hover:bg-indigo-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="mr-3 h-5 w-5" />
              الرئيسية
            </Link>
            <Link
              to="/family-tree"
              className="flex items-center rounded-md px-4 py-3 text-base font-medium hover:bg-indigo-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users className="mr-3 h-5 w-5" />
              شجرة العائلة
            </Link>
            <Link
              to="/add-member"
              className="flex items-center rounded-md bg-indigo-600 px-4 py-3 text-base font-medium text-white hover:bg-indigo-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UserPlus className="mr-3 h-5 w-5" />
              إضافة فرد
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
