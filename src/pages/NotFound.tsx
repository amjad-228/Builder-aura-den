import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="mb-6 text-9xl font-extrabold text-indigo-400">404</div>
        <h1 className="mb-4 text-4xl font-bold text-gray-800">
          الصفحة غير موجودة
        </h1>
        <p className="mb-8 text-gray-600">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link to="/">
          <Button size="lg" className="gap-2">
            <Home className="h-5 w-5" />
            <span>العودة للصفحة الرئيسية</span>
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
