# MarkVault

A Markdown document store for NexusLayer. Agents push MD files (with Mermaid diagrams), humans browse, search, and read them.

## Ports

| Service | Port |
|---------|------|
| Frontend | 4006 |
| API | 4086 |

## Agent API

Push a document:
```bash
curl -X POST http://192.168.68.111:4086/v1/docs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Architecture Doc",
    "content": "# Title\n\n```mermaid\ngraph TD\n  A --> B\n```",
    "tags": ["architecture", "backend"]
  }'
```

## Deploy

```bash
ssh thomas@192.168.68.111 "cd /opt/nexuslayer/markvault && docker-compose up --build -d"
```
