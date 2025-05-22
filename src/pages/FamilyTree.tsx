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
        {/* Controls */}
        <div className="border-b bg-white p-4 shadow-sm">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن فرد من العائلة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                {searchQuery && filteredMembers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full z-10 mt-1 w-full rounded-md border bg-white p-2 shadow-lg"
                  >
                    <div className="max-h-60 overflow-auto">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-100"
                          onClick={() => navigate(`/member/${member.id}`)}
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

              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-gray-100" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => setRootMember(familyData.members[0]?.id || "")}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                إعادة تعيين
              </Button>

              <Button onClick={() => navigate("/add-member")}>
                <UserPlus className="mr-2 h-4 w-4" />
                إضافة فرد
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="border-t pt-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">جذر الشجرة:</label>
                      <Select
                        value={selectedRoot}
                        onValueChange={handleChangeRoot}
                      >
                        <SelectTrigger className="w-[200px]">
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
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Tree Visualization */}
        <div className="container mx-auto flex-1 p-4">
          <div className="h-[calc(100vh-240px)] overflow-hidden rounded-xl border shadow-sm">
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

export default FamilyTree;
