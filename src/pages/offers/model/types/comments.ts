export interface Review {
  id: string;
  date: string;
  user: {
    name: string;
    avatarUrl?: string;
    isPro?: boolean;
  };
  comment?: string;
  rating: number;
}

export interface CommentDTO {
  comment: string;
  rating: number;
}
