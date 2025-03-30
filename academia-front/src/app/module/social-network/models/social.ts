export interface Researcher {
  id: number;
  name: string;
  title: string;
  institution: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  publications: number;
  citations: number;
  followers: number;
  researchInterests: string[];
  education: Education[];
  isFollowing: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Publication {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: string;
  citations: number;
  downloads: number;
  abstract: string;
  showAbstract?: boolean; // For UI toggling
}

export interface ResearchGroup {
  id: number;
  name: string;
  description: string;
  detailedDescription: string;
  coverImage: string;
  institution: string;
  memberCount: number;
  isPrivate: boolean;
  isMember: boolean;
  researchFocus: string[];
  rules: string[];
  admin?: {
    id: number;
    name: string;
  };
}

export interface Member {
  id: number;
  name: string;
  title: string;
  institution: string;
  profileImage: string;
  isAdmin: boolean;
}