import { useState, useEffect } from "react";
import { FamilyData, FamilyMember, FamilyTreeNode } from "@/types/family";

const DEFAULT_FAMILY_DATA: FamilyData = {
  members: [
    {
      id: "1",
      name: "أحمد محمد",
      birthDate: "1950-05-15",
      gender: "male",
      bio: "الجد الأكبر للعائلة",
      location: "الرياض",
      imageUrl: "/placeholder.svg",
      parentIds: [],
      spouseIds: ["2"],
      childrenIds: ["3", "4", "5"],
    },
    {
      id: "2",
      name: "فاطمة علي",
      birthDate: "1955-08-20",
      gender: "female",
      bio: "الجدة الكبرى للعائلة",
      location: "الرياض",
      imageUrl: "/placeholder.svg",
      parentIds: [],
      spouseIds: ["1"],
      childrenIds: ["3", "4", "5"],
    },
    {
      id: "3",
      name: "محمد أحمد",
      birthDate: "1975-03-10",
      gender: "male",
      bio: "الابن الأكبر",
      location: "جدة",
      imageUrl: "/placeholder.svg",
      parentIds: ["1", "2"],
      spouseIds: ["6"],
      childrenIds: ["7", "8"],
    },
    {
      id: "4",
      name: "نورة أحمد",
      birthDate: "1978-11-05",
      gender: "female",
      bio: "الابنة الوسطى",
      location: "الدمام",
      imageUrl: "/placeholder.svg",
      parentIds: ["1", "2"],
      spouseIds: ["9"],
      childrenIds: ["10", "11"],
    },
    {
      id: "5",
      name: "خالد أحمد",
      birthDate: "1980-07-22",
      gender: "male",
      bio: "الابن الأصغر",
      location: "الرياض",
      imageUrl: "/placeholder.svg",
      parentIds: ["1", "2"],
      spouseIds: [],
      childrenIds: [],
    },
    {
      id: "6",
      name: "منى سعد",
      birthDate: "1977-09-18",
      gender: "female",
      location: "جدة",
      imageUrl: "/placeholder.svg",
      parentIds: [],
      spouseIds: ["3"],
      childrenIds: ["7", "8"],
    },
    {
      id: "7",
      name: "أحمد محمد",
      birthDate: "2000-04-12",
      gender: "male",
      location: "جدة",
      imageUrl: "/placeholder.svg",
      parentIds: ["3", "6"],
      spouseIds: [],
      childrenIds: [],
    },
    {
      id: "8",
      name: "سارة محمد",
      birthDate: "2003-12-30",
      gender: "female",
      location: "جدة",
      imageUrl: "/placeholder.svg",
      parentIds: ["3", "6"],
      spouseIds: [],
      childrenIds: [],
    },
    {
      id: "9",
      name: "فهد سالم",
      birthDate: "1976-02-14",
      gender: "male",
      location: "الدمام",
      imageUrl: "/placeholder.svg",
      parentIds: [],
      spouseIds: ["4"],
      childrenIds: ["10", "11"],
    },
    {
      id: "10",
      name: "عبد الله فهد",
      birthDate: "2002-08-09",
      gender: "male",
      location: "الدمام",
      imageUrl: "/placeholder.svg",
      parentIds: ["4", "9"],
      spouseIds: [],
      childrenIds: [],
    },
    {
      id: "11",
      name: "ريم فهد",
      birthDate: "2005-05-25",
      gender: "female",
      location: "الدمام",
      imageUrl: "/placeholder.svg",
      parentIds: ["4", "9"],
      spouseIds: [],
      childrenIds: [],
    },
  ],
  rootMemberId: "1",
};

export const useFamilyData = () => {
  const [familyData, setFamilyData] = useState<FamilyData>(DEFAULT_FAMILY_DATA);
  const [treeData, setTreeData] = useState<FamilyTreeNode | null>(null);

  const addFamilyMember = (member: FamilyMember) => {
    // Add the new member to the collection
    setFamilyData((prev) => ({
      ...prev,
      members: [...prev.members, member],
    }));

    // Update parent-child relationships if needed
    if (member.parentIds.length > 0) {
      setFamilyData((prev) => ({
        ...prev,
        members: prev.members.map((m) =>
          member.parentIds.includes(m.id)
            ? { ...m, childrenIds: [...m.childrenIds, member.id] }
            : m,
        ),
      }));
    }

    // Update spouse relationships if needed
    if (member.spouseIds.length > 0) {
      setFamilyData((prev) => ({
        ...prev,
        members: prev.members.map((m) =>
          member.spouseIds.includes(m.id)
            ? { ...m, spouseIds: [...m.spouseIds, member.id] }
            : m,
        ),
      }));
    }
  };

  const updateFamilyMember = (
    id: string,
    updatedMember: Partial<FamilyMember>,
  ) => {
    setFamilyData((prev) => ({
      ...prev,
      members: prev.members.map((member) =>
        member.id === id ? { ...member, ...updatedMember } : member,
      ),
    }));
  };

  const deleteFamilyMember = (id: string) => {
    // Get the member to be deleted
    const memberToDelete = familyData.members.find((m) => m.id === id);
    if (!memberToDelete) return;

    // Remove from parents' childrenIds
    const updatedMembers = familyData.members.map((member) => {
      if (memberToDelete.parentIds.includes(member.id)) {
        return {
          ...member,
          childrenIds: member.childrenIds.filter((childId) => childId !== id),
        };
      }

      // Remove from spouses' spouseIds
      if (memberToDelete.spouseIds.includes(member.id)) {
        return {
          ...member,
          spouseIds: member.spouseIds.filter((spouseId) => spouseId !== id),
        };
      }

      // Set children's parentIds
      if (memberToDelete.childrenIds.includes(member.id)) {
        return {
          ...member,
          parentIds: member.parentIds.filter((parentId) => parentId !== id),
        };
      }

      return member;
    });

    // Remove the member itself
    setFamilyData({
      ...familyData,
      members: updatedMembers.filter((m) => m.id !== id),
      // If we're deleting the root, we need to set a new root
      rootMemberId:
        id === familyData.rootMemberId
          ? updatedMembers.find((m) => m.id !== id)?.id
          : familyData.rootMemberId,
    });
  };

  const getMemberById = (id: string): FamilyMember | undefined => {
    return familyData.members.find((member) => member.id === id);
  };

  const buildFamilyTree = (
    rootId: string = familyData.rootMemberId || "",
  ): FamilyTreeNode | null => {
    const root = familyData.members.find((m) => m.id === rootId);
    if (!root) return null;

    const buildTree = (member: FamilyMember, level: number): FamilyTreeNode => {
      const children: FamilyTreeNode[] = [];

      // Add children
      for (const childId of member.childrenIds) {
        const child = familyData.members.find((m) => m.id === childId);
        if (child) {
          children.push(buildTree(child, level + 1));
        }
      }

      return {
        member,
        children,
        level,
      };
    };

    return buildTree(root, 0);
  };

  // Rebuild tree when family data changes
  useEffect(() => {
    if (familyData.rootMemberId) {
      const tree = buildFamilyTree(familyData.rootMemberId);
      setTreeData(tree);
    }
  }, [familyData]);

  return {
    familyData,
    treeData,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    getMemberById,
    buildFamilyTree,
    setRootMember: (id: string) =>
      setFamilyData((prev) => ({ ...prev, rootMemberId: id })),
  };
};
