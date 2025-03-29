// src/types/group.ts
export interface Group {
    id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
    members?: string[];
    description?: string;
  }
  
  export interface GroupCreateInput {
    name: string;
    description?: string;
  }
  
  export interface GroupUpdateInput {
    id: string;
    name?: string;
    description?: string;
  }