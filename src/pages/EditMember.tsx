import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { useFamilyData } from "@/hooks/useFamilyData";
import { FamilyMember } from "@/types/family";

// Form schema
const memberSchema = z.object({
  name: z
    .string()
    .min(2, { message: "الاسم مطلوب ويجب أن يتكون من حرفين على الأقل" }),
  gender: z.enum(["male", "female"], {
    required_error: "يرجى تحديد النوع",
  }),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

const EditMember = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMemberById, updateFamilyMember, familyData } = useFamilyData();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [selectedSpouses, setSelectedSpouses] = useState<string[]>([]);

  // Initialize form with member data
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "",
      deathDate: "",
      location: "",
      bio: "",
    },
  });

  // Load member data
  useEffect(() => {
    if (!id) return;

    const memberData = getMemberById(id);
    if (!memberData) {
      navigate("/family-tree");
      return;
    }

    setMember(memberData);
    setSelectedParents(memberData.parentIds);
    setSelectedSpouses(memberData.spouseIds);

    // Set form values
    form.reset({
      name: memberData.name,
      gender: memberData.gender,
      birthDate: memberData.birthDate || "",
      deathDate: memberData.deathDate || "",
      location: memberData.location || "",
      bio: memberData.bio || "",
    });
  }, [id, getMemberById, navigate, form]);

  // Handle parent selection
  const handleParentSelect = (parentId: string) => {
    setSelectedParents((prev) => {
      if (prev.includes(parentId)) {
        return prev.filter((pid) => pid !== parentId);
      } else {
        return [...prev, parentId];
      }
    });
  };

  // Handle spouse selection
  const handleSpouseSelect = (spouseId: string) => {
    setSelectedSpouses((prev) => {
      if (prev.includes(spouseId)) {
        return prev.filter((sid) => sid !== spouseId);
      } else {
        return [...prev, spouseId];
      }
    });
  };

  // Handle form submission
  const onSubmit = (data: MemberFormValues) => {
    if (!member || !id) return;

    // Create updated member data
    const updatedMember: Partial<FamilyMember> = {
      name: data.name,
      gender: data.gender,
      birthDate: data.birthDate || undefined,
      deathDate: data.deathDate || undefined,
      location: data.location || undefined,
      bio: data.bio || undefined,
      parentIds: selectedParents,
      spouseIds: selectedSpouses,
    };

    // Update member
    updateFamilyMember(id, updatedMember);

    // Navigate to member details
    navigate(`/member/${id}`);
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

      <main className="flex-1 bg-gradient-to-br from-slate-50 to-gray-100 py-8">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto max-w-3xl">
              <Card className="shadow-md">
                <CardHeader
                  className={
                    member.gender === "male"
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50"
                      : "bg-gradient-to-r from-purple-50 to-pink-50"
                  }
                >
                  <CardTitle className="text-center text-xl">
                    تعديل بيانات {member.name}
                  </CardTitle>
                  <CardDescription className="text-center">
                    قم بتحديث المعلومات الخاصة بهذا الفرد
                  </CardDescription>
                </CardHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6 p-6">
                      <div className="space-y-4">
                        {/* Basic Information */}
                        <div className="rounded-md bg-slate-50 p-4">
                          <h3 className="mb-4 font-medium">معلومات أساسية</h3>

                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>الاسم الكامل*</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="أدخل الاسم الكامل"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="gender"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel>النوع*</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex space-x-4"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="male"
                                          id="male"
                                        />
                                        <label htmlFor="male" className="mr-2">
                                          ذكر
                                        </label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="female"
                                          id="female"
                                        />
                                        <label
                                          htmlFor="female"
                                          className="mr-2"
                                        >
                                          أنثى
                                        </label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Date Information */}
                        <div className="rounded-md bg-slate-50 p-4">
                          <h3 className="mb-4 font-medium">معلومات التواريخ</h3>

                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="birthDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>تاريخ الميلاد</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormDescription>اختياري</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="deathDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>تاريخ الوفاة</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    اختياري، اترك فارغاً إذا على قيد الحياة
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Location and Bio */}
                        <div className="rounded-md bg-slate-50 p-4">
                          <h3 className="mb-4 font-medium">معلومات إضافية</h3>

                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>المدينة</FormLabel>
                                  <FormControl>
                                    <Input placeholder="المدينة" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>نبذة قصيرة</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="اكتب نبذة قصيرة عن هذا الشخص"
                                      className="resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Relationships */}
                        <div className="rounded-md bg-slate-50 p-4">
                          <h3 className="mb-4 font-medium">
                            العلاقات العائلية
                          </h3>

                          <div className="space-y-4">
                            {/* Parents */}
                            <div>
                              <label className="block text-sm font-medium">
                                الوالدين
                              </label>
                              <p className="mb-2 text-xs text-gray-500">
                                حدد الوالدين من القائمة (يمكن اختيار أكثر من
                                واحد)
                              </p>

                              <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
                                {familyData.members
                                  .filter((m) => m.id !== id) // Exclude self
                                  .map((potentialParent) => (
                                    <div
                                      key={`parent-${potentialParent.id}`}
                                      className={`cursor-pointer rounded-md border p-2 text-sm transition-colors ${
                                        selectedParents.includes(
                                          potentialParent.id,
                                        )
                                          ? potentialParent.gender === "male"
                                            ? "border-blue-400 bg-blue-50"
                                            : "border-purple-400 bg-purple-50"
                                          : "border-gray-200 hover:bg-gray-50"
                                      }`}
                                      onClick={() =>
                                        handleParentSelect(potentialParent.id)
                                      }
                                    >
                                      <div className="font-medium">
                                        {potentialParent.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {potentialParent.gender === "male"
                                          ? "ذكر"
                                          : "أنثى"}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            {/* Spouses */}
                            <div>
                              <label className="block text-sm font-medium">
                                الزوج/الزوجة
                              </label>
                              <p className="mb-2 text-xs text-gray-500">
                                حدد الزوج أو الزوجة من القائمة (يمكن اختيار أكثر
                                من واحد)
                              </p>

                              <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
                                {familyData.members
                                  .filter((m) => m.id !== id) // Exclude self
                                  .map((potentialSpouse) => (
                                    <div
                                      key={`spouse-${potentialSpouse.id}`}
                                      className={`cursor-pointer rounded-md border p-2 text-sm transition-colors ${
                                        selectedSpouses.includes(
                                          potentialSpouse.id,
                                        )
                                          ? potentialSpouse.gender === "male"
                                            ? "border-blue-400 bg-blue-50"
                                            : "border-purple-400 bg-purple-50"
                                          : "border-gray-200 hover:bg-gray-50"
                                      }`}
                                      onClick={() =>
                                        handleSpouseSelect(potentialSpouse.id)
                                      }
                                    >
                                      <div className="font-medium">
                                        {potentialSpouse.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {potentialSpouse.gender === "male"
                                          ? "ذكر"
                                          : "أنثى"}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t bg-slate-50 px-6 py-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                      >
                        إلغاء
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        حفظ التغييرات
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditMember;
