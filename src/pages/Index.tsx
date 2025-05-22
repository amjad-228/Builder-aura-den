import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 text-white sm:py-20">
          <div className="absolute inset-0 z-0 opacity-30">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="family-pattern"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M20,20 C25,15 25,25 30,20"
                    stroke="white"
                    strokeWidth="0.5"
                    fill="none"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#family-pattern)" />
            </svg>
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center">
              <motion.h1
                className="mb-4 text-3xl font-bold leading-tight sm:mb-6 sm:text-4xl md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                شجرة العائلة الخاصة بك
              </motion.h1>

              <motion.p
                className="mb-6 max-w-2xl text-base sm:mb-8 sm:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                احفظ تاريخ عائلتك وتعرف على أجدادك وأقاربك بطريقة سهلة وممتعة
              </motion.p>

              <motion.div
                className="flex flex-col gap-3 sm:flex-row sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link to="/family-tree" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-white text-indigo-600 hover:bg-indigo-100 sm:w-auto"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    استعرض شجرة العائلة
                  </Button>
                </Link>

                <Link to="/add-member" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white text-white hover:bg-white/20 sm:w-auto"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    أضف فرد جديد للعائلة
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Wave SVG at bottom */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,106.7C672,85,768,75,864,90.7C960,107,1056,149,1152,154.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10 sm:py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 sm:mb-12 md:text-3xl">
              ميزات رائعة للحفاظ على تراث عائلتك
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <motion.div
                className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-md sm:p-6"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 sm:mb-4 sm:h-14 sm:w-14">
                  <svg
                    className="h-6 w-6 sm:h-7 sm:w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold sm:mb-3 sm:text-xl">
                  حفظ المعلومات
                </h3>
                <p className="text-sm text-gray-600 sm:text-base">
                  سجل المعلومات الكاملة لكل فرد من أفراد العائلة، بما في ذلك
                  الصور والتواريخ والقصص.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-5 shadow-md sm:p-6"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 sm:mb-4 sm:h-14 sm:w-14">
                  <svg
                    className="h-6 w-6 sm:h-7 sm:w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold sm:mb-3 sm:text-xl">
                  العرض التفاعلي
                </h3>
                <p className="text-sm text-gray-600 sm:text-base">
                  استعرض شجرة العائلة بطريقة تفاعلية جذابة، مع إمكانية التكبير
                  والتصغير والتنقل بسهولة.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-5 shadow-md sm:p-6"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 sm:mb-4 sm:h-14 sm:w-14">
                  <Search className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="mb-2 text-lg font-semibold sm:mb-3 sm:text-xl">
                  البحث السريع
                </h3>
                <p className="text-sm text-gray-600 sm:text-base">
                  ابحث عن أي فرد من أفراد العائلة بسرعة وسهولة واعرض المعلومات
                  الخاصة به.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-100 to-purple-100 py-10 sm:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 sm:mb-6 sm:text-3xl">
              ابدأ الآن بحفظ تاريخ عائلتك
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-sm text-gray-600 sm:mb-8 sm:text-base">
              لا تدع ذكريات العائلة وتاريخها يضيع مع مرور الزمن. سجل المعلومات
              الآن وشاركها مع الأجيال القادمة.
            </p>
            <Link to="/family-tree">
              <Button
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700 sm:w-auto"
              >
                استكشف شجرة العائلة
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
