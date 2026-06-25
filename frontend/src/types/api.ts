export interface UserDTO {
  id: string
  email: string
  name: string
}

export interface DocSummary {
  id: string
  title: string
  tags: string[]
  pushed_by: string
  created_at: string
  updated_at: string
}

export interface Doc extends DocSummary {
  content: string
}

export interface CreateDocRequest {
  title: string
  content: string
  tags?: string[]
}
