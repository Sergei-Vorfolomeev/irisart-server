export interface PostInputModel {
  title: string
  description: string
  content: string
  theme: PostTheme
  image?: string
}

export interface PostViewModel {
  id: string
  theme?: string
  title: string
  description: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface PostDbModel {
  id?: string
  title: string
  description: string
  content: string
  theme: PostTheme
  image?: string
  created_at?: Date
  updated_at?: Date
}

export enum PostTheme {
  ALL = 'all',
}
