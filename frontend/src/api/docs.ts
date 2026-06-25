import { apiClient } from './client'
import type { Doc, DocSummary, CreateDocRequest } from '../types/api'

export const docsApi = {
  list: (q?: string, tags?: string[]) =>
    apiClient.get<DocSummary[]>('/docs', {
      params: { q: q || undefined, tags: tags?.length ? tags.join(',') : undefined },
    }),
  get: (id: string) => apiClient.get<Doc>(`/docs/${id}`),
  create: (data: CreateDocRequest) => apiClient.post<Doc>('/docs', data),
  update: (id: string, data: Partial<CreateDocRequest>) => apiClient.put<Doc>(`/docs/${id}`, data),
  delete: (id: string) => apiClient.delete(`/docs/${id}`),
  tags: () => apiClient.get<string[]>('/docs/tags'),
}
