 -  # Log Ingestor and Query Interface - Backend

  This backend service provides:

   -  High-throughput log ingestion via HTTP
   - Fast full-text search & filtering using Elasticsearch
   - Asynchronous processing with queue (BullMQ + Redis)
   - Real-time log streaming via WebSockets (Socket.IO)

# Prerequisites

- Install Docker Desktop on your local machine.
- Node.js (v22+ recommended)

# Instruction to set up the project locally

1. Clone the project repo

```bash
git clone https://github.com/roshidhmohammed/Log-Ingestor-and-Query-Interface-Backend.git
cd log-system-backend
```
   

4.  Start the project using below command

```bash
 docker compose up -d
```

```bash
 npm run dev
```

5. Default Server

```bash
 http://localhost:3000
```


# Tech Stack.

- **Express.js** - Server side framework for node.js 
- **zod** - Input/ all type of data validation
- **nodemon** - Development auto-restart
- **Docker** - Containerization to work across all environments on smoothly
- **Elasticsearch** - Search & indexing
- **Redis** - Queue backend
- **BullMQ** - Job queue
- **Socket.IO** - Real Time Communication

# Strategies for handling concurrency.

1. High-Throughput Ingestion:
   - Handles thousands of logs/sec
   - Non-blocking ingestion
   - Asynchronous queue processing

2. Queue-Based Processing:
   - BullMQ + Redis
   - Batch processing for performance
   - Prevents system overload

3. Advanced Search:
   - Full-text search (multi-field)
   - Regex-based search
   - Combined filters
   - Date range filtering

4. Real-Time Logs:
   - WebSocket (Socket.IO) integration
   - Live log streaming to frontend

5. Scalable Design:
   - Decoupled ingestion & processing

6. Performance Optimizations:
   - Batch queue insertion
   - Elasticsearch bulk indexing
   - Async request handling
   - Optimized query structure


# Project Structure:

src/
  -  config/          # Elasticsearch config
  -  controllers/     # API handlers
  -  routes/          # API routes
  -  services/        # Business logic
  -  queue/           # BullMQ queue setup
  -  workers/         # Background processing
  -  validators/      # Input validation
  -  app.js
  -  server.js
