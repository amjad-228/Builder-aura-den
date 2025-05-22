import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, Search, RefreshCw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { TreeVisualization } from "@/components/FamilyTree/TreeVisualization";
import { useFamilyData } from "@/hooks/useFamilyData";
import { FamilyMember } from "@/types/family";

const FamilyTree = () => {
  const navigate = useNavigate();
  const { familyData, treeData, getMemberById, setRootMember } =
    useFamilyData();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoot, setSelectedRoot] = useState<string | undefined>(
    familyData.rootMemberId,
  );

  // Filter members for search
  const filteredMembers = searchQuery
    ? familyData.members.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  // Handle changing root member
  const handleChangeRoot = (memberId: string) => {
    setSelectedRoot(memberId);
    setRootMember(memberId);
  };

  // Handle member selection from tree
  const handleSelectMember = (memberId: string) => {
    navigate(`/member/${memberId}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Controls - More compact for mobile */}
        <div className="border-b bg-white p-2 shadow-sm sm:p-3">
          <div className="container mx-auto">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن فرد من العائلة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-8 text-sm"
                />
                {searchQuery && filteredMembers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full z-20 mt-1 w-full rounded-md border bg-white p-2 shadow-lg"
                  >
                    <div className="max-h-48 overflow-auto">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          className="cursor-pointer rounded-md px-3 py-2.5 hover:bg-gray-100"
                          onClick={() => {
                            navigate(`/member/${member.id}`);
                            setSearchQuery(""); // Clear search after selection
                          }}
                        >
                          <div className="font-medium">{member.name}</div>
                          {member.birthDate && (
                            <div className="text-xs text-gray-500">
                              {new Date(member.birthDate).toLocaleDateString(
                                "ar-SA",
                                { year: "numeric" },
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "h-9 w-9 p-0",
                    showFilters ? "bg-gray-100" : "",
                  )}
                >
                  <Filter className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRootMember(familyData.members[0]?.id || "")}
                  className="h-9 px-2 text-xs"
                >
                  <RefreshCw className="mr-1 h-4 w-4" />
                  إعادة تعيين
                </Button>

                <Button
                  size="sm"
                  onClick={() => navigate("/add-member")}
                  className="h-9 px-2 text-xs"
                >
                  <UserPlus className="mr-1 h-4 w-4" />
                  إضافة فرد
                </Button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 overflow-hidden sm:mt-3"
              >
                <div className="border-t pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="text-sm font-medium">جذر الشجرة:</label>
                    <Select
                      value={selectedRoot}
                      onValueChange={handleChangeRoot}
                    >
                      <SelectTrigger className="h-9 flex-1 text-sm sm:w-[200px]">
                        <SelectValue placeholder="اختر فرد كجذر للشجرة" />
                      </SelectTrigger>
                      <SelectContent>
                        {familyData.members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Tree Visualization - Full height on mobile */}
        <div className="flex-1 p-0 sm:container sm:mx-auto sm:p-2">
          <div className="h-[calc(100vh-125px)] overflow-hidden rounded-none border shadow-sm sm:h-[calc(100vh-150px)] sm:rounded-xl">
            <TreeVisualization
              treeData={treeData}
              onSelectMember={handleSelectMember}
            />
          </div>
        </div>
      </main>

      <Footer className="mt-auto" />
    </div>
  );
};

// Import missing cn function
import { cn } from "@/lib/utils";

export default FamilyTree;
