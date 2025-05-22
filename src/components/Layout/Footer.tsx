import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer
      className={cn(
        "w-full border-t bg-gradient-to-r from-violet-50 to-blue-50 py-6",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
          <p className="text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} شجرة العائل�� جميع الحقوق محفوظة
          </p>
          <span className="hidden md:block">•</span>
          <p className="flex items-center text-center text-sm text-gray-600">
            صنع بكل <Heart size={14} className="mx-1 text-red-500" /> للحفاظ على
            تراث العائلة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
