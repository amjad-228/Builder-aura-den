import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Calendar,
  MapPin,
  Users,
  User,
  Heart,
  BadgeInfo,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FamilyMemberCard } from "@/components/FamilyTree/FamilyMemberCard";
import { useFamilyData } from "@/hooks/useFamilyData";
import { FamilyMember } from "@/types/family";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { cn } from "@/lib/utils";

const MemberDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { familyData, getMemberById, deleteFamilyMember } = useFamilyData();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [parents, setParents] = useState<FamilyMember[]>([]);
  const [children, setChildren] = useState<FamilyMember[]>([]);
  const [siblings, setSiblings] = useState<FamilyMember[]>([]);
  const [spouses, setSpouses] = useState<FamilyMember[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "غير معروف";
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Load member data
  useEffect(() => {
    if (!id) return;

    const memberData = getMemberById(id);
    if (!memberData) {
      navigate("/family-tree");
      return;
    }

    setMember(memberData);

    // Get parents
    const parentMembers = memberData.parentIds
      .map((parentId) => getMemberById(parentId))
      .filter(Boolean) as FamilyMember[];
    setParents(parentMembers);

    // Get children
    const childrenMembers = memberData.childrenIds
      .map((childId) => getMemberById(childId))
      .filter(Boolean) as FamilyMember[];
    setChildren(childrenMembers);

    // Get spouses
    const spouseMembers = memberData.spouseIds
      .map((spouseId) => getMemberById(spouseId))
      .filter(Boolean) as FamilyMember[];
    setSpouses(spouseMembers);

    // Get siblings (common parent)
    if (parentMembers.length > 0) {
      const siblingIds = new Set<string>();
      parentMembers.forEach((parent) => {
        parent.childrenIds.forEach((childId) => {
          if (childId !== id) {
            siblingIds.add(childId);
          }
        });
      });

      const siblingMembers = Array.from(siblingIds)
        .map((siblingId) => getMemberById(siblingId))
        .filter(Boolean) as FamilyMember[];
      setSiblings(siblingMembers);
    }
  }, [id, getMemberById, navigate, familyData]);

  // Handle member deletion
  const handleDeleteMember = () => {
    if (id) {
      deleteFamilyMember(id);
      navigate("/family-tree");
    }
  };

  if (!member) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-600">
              جاري تحميل البيانات...
            </h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-slate-50 to-gray-100 pb-12 pt-8">
        <div className="container mx-auto px-4">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              العودة
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Member Information */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  className={cn(
                    "overflow-hidden shadow-lg",
                    member.gender === "male"
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50"
                      : "bg-gradient-to-br from-purple-50 to-pink-50",
                  )}
                >
                  <div
                    className={cn(
                      "h-2",
                      member.gender === "male"
                        ? "bg-blue-500"
                        : "bg-purple-500",
                    )}
                  />
                  <CardHeader className="pt-6 text-center">
                    <div className="mx-auto">
                      <Avatar
                        className={cn(
                          "h-24 w-24 ring-4",
                          member.gender === "male"
                            ? "ring-blue-200"
                            : "ring-purple-200",
                        )}
                      >
                        <AvatarImage src={member.imageUrl} alt={member.name} />
                        <AvatarFallback
                          className={cn(
                            "text-xl",
                            member.gender === "male"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-purple-100 text-purple-600",
                          )}
                        >
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="mt-4 text-2xl font-bold">
                      {member.name}
                    </CardTitle>
                    <div className="mt-1 flex justify-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          member.gender === "male"
                            ? "border-blue-200 bg-blue-100 text-blue-700"
                            : "border-purple-200 bg-purple-100 text-purple-700",
                        )}
                      >
                        {member.gender === "male" ? "ذكر" : "أنثى"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>تاريخ الميلاد:</span>
                          <span className="font-medium">
                            {formatDate(member.birthDate)}
                          </span>
                        </div>

                        {member.deathDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={16} />
                            <span>تاريخ الوفاة:</span>
                            <span className="font-medium">
                              {formatDate(member.deathDate)}
                            </span>
                          </div>
                        )}

                        {member.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={16} />
                            <span>المدينة:</span>
                            <span className="font-medium">
                              {member.location}
                            </span>
                          </div>
                        )}
                      </div>

                      {member.bio && (
                        <div>
                          <h3 className="mb-2 flex items-center gap-1 font-medium">
                            <BadgeInfo size={16} />
                            <span>نبذة</span>
                          </h3>
                          <p className="text-sm text-gray-600">{member.bio}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Link to={`/edit-member/${member.id}`}>
                      <Button variant="outline" className="gap-1">
                        <Edit size={16} />
                        <span>تعديل</span>
                      </Button>
                    </Link>

                    <Dialog
                      open={deleteDialogOpen}
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="gap-1">
                          <Trash2 size={16} />
                          <span>حذف</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>تأكيد الحذف</DialogTitle>
                          <DialogDescription>
                            هل أنت متأكد من رغبتك في حذف {member.name} من شجرة
                            العائلة؟
                            <br />
                            لا يمكن التراجع عن هذا الإجراء.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="ghost"
                            onClick={() => setDeleteDialogOpen(false)}
                          >
                            إلغاء
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteMember}
                          >
                            تأكيد الحذف
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>

            {/* Family Relationships */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-8">
                {/* Parents */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center">
                        <Users className="mr-2 h-5 w-5 text-indigo-600" />
                        <CardTitle>الوالدين</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {parents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {parents.map((parent) => (
                            <FamilyMemberCard key={parent.id} member={parent} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          لا توجد معلومات عن الوالدين
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Spouses */}
                {spouses.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center">
                          <Heart className="mr-2 h-5 w-5 text-red-500" />
                          <CardTitle>
                            {member.gender === "male" ? "الزوجات" : "الأزواج"}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {spouses.map((spouse) => (
                            <FamilyMemberCard key={spouse.id} member={spouse} />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Children */}
                {children.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center">
                          <User className="mr-2 h-5 w-5 text-green-600" />
                          <CardTitle>الأبناء</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                          {children.map((child) => (
                            <FamilyMemberCard key={child.id} member={child} />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Siblings */}
                {siblings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center">
                          <Users className="mr-2 h-5 w-5 text-amber-600" />
                          <CardTitle>الإخوة والأخوات</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                          {siblings.map((sibling) => (
                            <FamilyMemberCard
                              key={sibling.id}
                              member={sibling}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemberDetails;
