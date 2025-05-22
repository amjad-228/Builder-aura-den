export interface FamilyMember {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  gender: "male" | "female";
  bio?: string;
  location?: string;
  imageUrl?: string;
  parentIds: string[];
  spouseIds: string[];
  childrenIds: string[];
}

export interface FamilyData {
  members: FamilyMember[];
  rootMemberId?: string;
}

export interface FamilyTreeNode {
  member: FamilyMember;
  children: FamilyTreeNode[];
  level: number;
  x?: number;
  y?: number;
}
