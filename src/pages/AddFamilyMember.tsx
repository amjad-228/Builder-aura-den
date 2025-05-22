import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  parentIds: z.array(z.string()).default([]),
  spouseIds: z.array(z.string()).default([]),
});

type MemberFormValues = z.infer<typeof memberSchema>;

const AddFamilyMember = () => {
  const navigate = useNavigate();
  const { familyData, addFamilyMember } = useFamilyData();
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [selectedSpouses, setSelectedSpouses] = useState<string[]>([]);

  // Initialize form
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "",
      deathDate: "",
      location: "",
      bio: "",
      parentIds: [],
      spouseIds: [],
    },
  });

  // Handle parent selection
  const handleParentSelect = (parentId: string) => {
    setSelectedParents((prev) => {
      if (prev.includes(parentId)) {
        return prev.filter((id) => id !== parentId);
      } else {
        return [...prev, parentId];
      }
    });
  };

  // Handle spouse selection
  const handleSpouseSelect = (spouseId: string) => {
    setSelectedSpouses((prev) => {
      if (prev.includes(spouseId)) {
        return prev.filter((id) => id !== spouseId);
      } else {
        return [...prev, spouseId];
      }
    });
  };

  // Handle form submission
  const onSubmit = (data: MemberFormValues) => {
    // Create new family member with generated ID
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: data.name,
      gender: data.gender,
      birthDate: data.birthDate || undefined,
      deathDate: data.deathDate || undefined,
      location: data.location || undefined,
      bio: data.bio || undefined,
      imageUrl: "/placeholder.svg",
      parentIds: selectedParents,
      spouseIds: selectedSpouses,
      childrenIds: [],
    };

    // Add to family data
    addFamilyMember(newMember);

    // Navigate to the new member's details page
    navigate(`/member/${newMember.id}`);
  };

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
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-xl text-center">
                    إضافة فرد جديد للعائلة
                  </CardTitle>
                  <CardDescription className="text-center">
                    أدخل المعلومات الخاصة بالفرد الجديد
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
                                    اختياري، اترك فارغاً إذا ��لى قيد الحياة
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
                                {familyData.members.map((member) => (
                                  <div
                                    key={`parent-${member.id}`}
                                    className={`cursor-pointer rounded-md border p-2 text-sm transition-colors ${
                                      selectedParents.includes(member.id)
                                        ? member.gender === "male"
                                          ? "border-blue-400 bg-blue-50"
                                          : "border-purple-400 bg-purple-50"
                                        : "border-gray-200 hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      handleParentSelect(member.id)
                                    }
                                  >
                                    <div className="font-medium">
                                      {member.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {member.gender === "male"
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
                                {familyData.members.map((member) => (
                                  <div
                                    key={`spouse-${member.id}`}
                                    className={`cursor-pointer rounded-md border p-2 text-sm transition-colors ${
                                      selectedSpouses.includes(member.id)
                                        ? member.gender === "male"
                                          ? "border-blue-400 bg-blue-50"
                                          : "border-purple-400 bg-purple-50"
                                        : "border-gray-200 hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      handleSpouseSelect(member.id)
                                    }
                                  >
                                    <div className="font-medium">
                                      {member.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {member.gender === "male"
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
                        حفظ
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

export default AddFamilyMember;
