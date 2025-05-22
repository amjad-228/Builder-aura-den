import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, Trash2, Info, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FamilyMember } from "@/types/family";
import { cn } from "@/lib/utils";

interface FamilyMemberCardProps {
  member: FamilyMember;
  compact?: boolean;
  onDelete?: (id: string) => void;
  className?: string;
}

export const FamilyMemberCard = ({
  member,
  compact = false,
  onDelete,
  className,
}: FamilyMemberCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // Extract initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format birth date
  const formatBirthDate = (dateString?: string) => {
    if (!dateString) return "غير معروف";
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleTouchStart = () => {
    setIsTouched(true);
    // Auto reset after 1.5 seconds
    setTimeout(() => setIsTouched(false), 1500);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
    >
      <Card
        className={cn(
          "overflow-hidden transition-shadow duration-300",
          compact ? "w-full max-w-36" : "w-full max-w-xs",
          member.gender === "male"
            ? "bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-blue-200/50"
            : "bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-purple-200/50",
          isHovered || isTouched ? "shadow-lg" : "shadow-md",
        )}
      >
        <div
          className={cn(
            "h-1.5",
            member.gender === "male" ? "bg-blue-500" : "bg-purple-500",
          )}
        />
        <CardContent className={cn("p-3", compact ? "pb-1" : "pb-3")}>
          <div className="flex flex-col items-center gap-2">
            <Avatar
              className={cn(
                "ring-2",
                member.gender === "male" ? "ring-blue-200" : "ring-purple-200",
                compact ? "h-12 w-12" : "h-16 w-16",
              )}
            >
              <AvatarImage src={member.imageUrl} alt={member.name} />
              <AvatarFallback
                className={cn(
                  member.gender === "male"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-purple-100 text-purple-600",
                )}
              >
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h3
                className={cn(
                  "font-bold line-clamp-1",
                  compact ? "text-sm" : "text-base",
                  member.gender === "male"
                    ? "text-blue-900"
                    : "text-purple-900",
                )}
              >
                {member.name}
              </h3>

              {!compact && member.bio && (
                <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                  {member.bio}
                </p>
              )}

              {!compact && (
                <div className="mt-2 space-y-1">
                  {member.birthDate && (
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                      <Calendar size={10} />
                      <span className="text-xs">
                        {formatBirthDate(member.birthDate)}
                      </span>
                    </div>
                  )}

                  {member.location && (
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                      <MapPin size={10} />
                      <span className="text-xs">{member.location}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {!compact && (
          <CardFooter className="flex justify-center gap-1 p-3 pt-0">
            <Link to={`/member/${member.id}`}>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-8 gap-1 px-2 py-1 text-xs",
                  member.gender === "male"
                    ? "hover:bg-blue-50"
                    : "hover:bg-purple-50",
                )}
              >
                <Info size={12} />
                <span>التفاصيل</span>
              </Button>
            </Link>
            <Link to={`/edit-member/${member.id}`}>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-8 gap-1 px-2 py-1 text-xs",
                  member.gender === "male"
                    ? "hover:bg-blue-50"
                    : "hover:bg-purple-50",
                )}
              >
                <Edit size={12} />
                <span>تعديل</span>
              </Button>
            </Link>
          </CardFooter>
        )}

        {compact && (
          <CardFooter className="flex justify-center p-1">
            <Link to={`/member/${member.id}`}>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                aria-label="عرض التفاصيل"
              >
                <Info size={12} />
              </Button>
            </Link>
          </CardFooter>
        )}

        {onDelete && (isHovered || isTouched) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -right-1 -top-1"
          >
            <Button
              size="sm"
              variant="destructive"
              className="h-6 w-6 rounded-full p-0"
              onClick={() => onDelete(member.id)}
              aria-label="حذف"
            >
              <Trash2 size={12} />
            </Button>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};
