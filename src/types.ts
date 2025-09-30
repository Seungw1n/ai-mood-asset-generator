

export interface Style {
  style: string;
  material: string;
  finish: string;
  texture: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  style: Style;
  creator: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  style: Style;
  workspaceId: string;
  createdAt: string;
}
