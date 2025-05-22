import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer
      className={cn(
        "w-full border-t bg-gradient-to-r from-violet-50 to-blue-50 py-4 sm:py-6",
        className,
      )}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col items-center justify-center gap-1 md:flex-row md:gap-2">
          <p className="text-center text-xs text-gray-600 sm:text-sm">
            &copy; {new Date().getFullYear()} شجرة العائلة جميع الحقوق محفوظة
          </p>
          <span className="hidden md:block">•</span>
          <p className="flex items-center text-center text-xs text-gray-600 sm:text-sm">
            صنع بكل{" "}
            <Heart size={12} className="mx-1 text-red-500 sm:h-3.5 sm:w-3.5" />{" "}
            للحفاظ على تراث العائلة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
