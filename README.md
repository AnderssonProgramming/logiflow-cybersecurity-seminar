<div align="center">

# 🚛 LogiFlow Core Backend

**AI-Powered Real-Time Dynamic Fleet Routing Platform**

[![NestJS](https://img.shields.io/badge/NestJS-11.x-ea2845?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Jest](https://img.shields.io/badge/Tests-Jest_30-c21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![gRPC](https://img.shields.io/badge/gRPC-Protocol_Buffers-244c5a?logo=google&logoColor=white)](https://grpc.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Client-010101?logo=socket.io&logoColor=white)](https://socket.io/)


NestJS core backend that orchestrates n8n automation workflows, a gRPC route optimizer (VROOM), and a Socket.io real-time gateway for dynamic fleet routing.

</div>

---

## 📑 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Webhook](#webhook)
  - [Vehicles CRUD](#vehicles-crud)
  - [Stops CRUD](#stops-crud)
- [Integrations](#integrations)
  - [gRPC — Route Optimizer](#grpc--route-optimizer)
  - [Socket.io — Real-Time Gateway](#socketio--real-time-gateway)
  - [n8n — Workflow Automation](#n8n--workflow-automation)
- [Testing](#testing)
- [Team](#team)

---

## Overview

**LogiFlow** is a university project for the subject ARSW — Software Architecture that solves the Vehicle Routing Problem (VRP) in real time. When a logistics event occurs (new order, traffic jam, vehicle breakdown, weather change), the system re-optimizes delivery routes dynamically and pushes updates to connected map clients instantly.

This repository contains the **Core Backend** — the central NestJS service that:

1. **Receives events** from n8n automation via a webhook endpoint.
2. **Requests route optimization** from a Python/VROOM gRPC microservice.
3. **Pushes optimized routes** to a Socket.io real-time gateway for live map rendering.
4. **Exposes a REST API** for managing vehicles and stops (delivery points).

---

## Architecture

```
┌─────────────┐       POST /webhook       ┌──────────────────────┐
│   n8n       │ ───────────────────────▶  │  NestJS Core Backend │
│             │                           │                      │
└─────────────┘                           │                      │
                                           │  ┌───────────────┐  │
                                           │  │ WebhookModule │  │
                                           │  └───────┬───────┘  │
                                           │          │          │
                                           │          ▼          │
                                           │  ┌───────────────┐  │
                                           │  │ GrpcClient     │──┼──▶ gRPC   :50051
                                           │  └───────┬───────┘  │
                                           │          │          │
                                           │          ▼          │
                                           │  ┌───────────────┐  │
                                           │  │ SocketClient   │──┼──▶ Socket.io :3001
                                           │  │ Module         │  │    (Elizabeth - Gateway)
                                           │  └───────────────┘  │
                                           │                      │
                                           │  ┌───────────────┐  │
                                           │  │ VehiclesModule │  │   REST CRUD
                                           │  ├───────────────┤  │   /api/v1/vehicles
                                           │  │ StopsModule    │  │   /api/v1/stops
                                           │  └───────────────┘  │
                                           └──────────────────────┘
```

### Data Flow

```
Event (n8n) → Webhook → Build gRPC Request → Call Optimizer → Receive Routes
                                                                    │
                                     ┌──────────────────────────────┘
                                     ▼
                              Emit to Socket.io  →  Elizabeth's Gateway  → Map UI
                                     │
                                     ▼
                              Return HTTP Response to n8n
```

---

## Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| **NestJS** | Backend framework (modules, DI, decorators) | 11.x |
| **TypeScript** | Type-safe development | 5.7 |
| **Express** | HTTP platform under NestJS | 5.x |
| **class-validator** | DTO validation with decorators | 0.15 |
| **class-transformer** | DTO transformation (nested objects) | 0.5 |
| **@grpc/grpc-js** | gRPC client for VROOM optimizer | 1.14 |
| **@grpc/proto-loader** | Load .proto files at runtime | 0.8 |
| **socket.io-client** | Socket.io client to Elizabeth's gateway | 4.8 |
| **@nestjs/config** | Environment variable management | 4.x |
| **Jest** | Unit & E2E testing | 30.x |
| **Supertest** | HTTP assertion for E2E tests | 7.x |

---

## Project Structure

```
logiflow-core-backend/
├── .env                              # Environment variables (not committed)
├── .env.example                      # Template for environment setup
├── nest-cli.json                     # NestJS CLI config (proto assets)
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── tsconfig.build.json               # Build-specific TS config
│
├── src/
│   ├── main.ts                       # Bootstrap: CORS, prefix, ValidationPipe
│   ├── app.module.ts                 # Root module (imports all feature modules)
│   ├── app.controller.ts             # GET /health endpoint
│   ├── app.service.ts                # Health check logic
│   ├── app.controller.spec.ts        # Health endpoint unit test
│   │
│   ├── webhook/                      # n8n webhook integration
│   │   ├── webhook.controller.ts     # POST /webhook
│   │   ├── webhook.service.ts        # Core: gRPC call → Socket.io emit
│   │   ├── webhook.module.ts         # Module definition
│   │   ├── webhook.controller.spec.ts
│   │   ├── webhook.service.spec.ts
│   │   └── dto/
│   │       ├── vehicle.dto.ts        # Vehicle validation (lat, lng, capacity)
│   │       ├── stop.dto.ts           # Stop validation (lat, lng, demand)
│   │       └── webhook-event.dto.ts  # Event envelope (eventType, vehicles, stops)
│   │
│   ├── grpc-client/                  # gRPC client for VROOM optimizer
│   │   ├── grpc-client.service.ts    # solveRoute() → Promise<SolveRouteResponse>
│   │   ├── grpc-client.module.ts     # ClientsModule.registerAsync (Transport.GRPC)
│   │   ├── grpc-client.service.spec.ts
│   │   ├── interfaces/
│   │   │   └── route-optimizer.interface.ts  # TypeScript interfaces
│   │   └── proto/
│   │       └── route-optimizer.proto         # Protobuf service definition
│   │
│   ├── socket-client/                # Socket.io client to Elizabeth's gateway
│   │   ├── socket-client.service.ts  # io() connection, emitRouteUpdate()
│   │   ├── socket-client.module.ts   # Module wrapper
│   │   └── socket-client.service.spec.ts
│   │
│   ├── vehicles/                     # Vehicles REST API
│   │   ├── vehicles.controller.ts    # CRUD endpoints: GET, POST, PUT, DELETE
│   │   ├── vehicles.service.ts       # In-memory Map storage + VehicleEntity
│   │   ├── vehicles.module.ts
│   │   ├── vehicles.controller.spec.ts
│   │   ├── vehicles.service.spec.ts
│   │   └── dto/
│   │       ├── create-vehicle.dto.ts # Validated create payload
│   │       └── update-vehicle.dto.ts # Partial update payload
│   │
│   └── stops/                        # Stops/Orders REST API
│       ├── stops.controller.ts       # CRUD endpoints: GET, POST, PUT, DELETE
│       ├── stops.service.ts          # In-memory Map storage + StopEntity
│       ├── stops.module.ts
│       ├── stops.controller.spec.ts
│       ├── stops.service.spec.ts
│       └── dto/
│           ├── create-stop.dto.ts    # Validated create payload
│           └── update-stop.dto.ts    # Partial update payload
│
└── test/
    ├── app.e2e-spec.ts               # E2E tests (health, webhook, CRUD)
    └── jest-e2e.json                 # Jest E2E configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 22.x
- **npm** >= 10.x

### Installation

```bash
git clone https://github.com/<your-org>/logiflow-core-backend.git
cd logiflow-core-backend
npm install
```

### Environment Variables

Copy the template and adjust values as needed:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP server port |
| `GRPC_OPTIMIZER_HOST` | `localhost` | gRPC optimizer hostname |
| `GRPC_OPTIMIZER_PORT` | `50051` | gRPC optimizer port |
| `SOCKETIO_SERVER_HOST` | `localhost` | Socket.io gateway hostname |
| `SOCKETIO_SERVER_PORT` | `3001` | Socket.io gateway port |

### Running the Application

```bash
# Development (hot-reload)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The server starts at `http://localhost:3000/api/v1`.

---

## API Endpoints

All endpoints are prefixed with `/api/v1`. Validation is enforced globally via `ValidationPipe` (whitelist mode).

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Returns service status |

**Response:**
```json
{
  "status": "ok",
  "service": "logiflow-core-backend",
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

### Webhook

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/webhook` | Receive logistics events from n8n |

**Request Body:**
```json
{
  "eventType": "new_order",
  "vehicles": [
    { "id": "v1", "lat": 4.711, "lng": -74.072, "capacity": 100 }
  ],
  "stops": [
    { "id": "s1", "lat": 4.609, "lng": -74.081, "demand": 20 }
  ]
}
```

Valid `eventType` values: `traffic_jam`, `new_order`, `vehicle_breakdown`, `weather_change`.

**Response:**
```json
{
  "received": true,
  "eventType": "new_order",
  "vehicleCount": 1,
  "stopCount": 1,
  "optimizedRoutes": { "routes": [...], "totalCost": 100, "solvedAt": "..." },
  "socketConnected": false,
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

### Vehicles CRUD

| Method | Endpoint | Description | Status |
|---|---|---|---|
| `GET` | `/api/v1/vehicles` | List all vehicles | 200 |
| `GET` | `/api/v1/vehicles/:id` | Get vehicle by ID | 200 / 404 |
| `POST` | `/api/v1/vehicles` | Create a vehicle | 201 |
| `PUT` | `/api/v1/vehicles/:id` | Update a vehicle | 200 / 404 |
| `DELETE` | `/api/v1/vehicles/:id` | Delete a vehicle | 204 / 404 |

**Create body:**
```json
{
  "id": "v1",        // optional — auto-generated UUID if omitted
  "lat": 4.711,      // required — range: -90 to 90
  "lng": -74.072,    // required — range: -180 to 180
  "capacity": 100    // required — min: 0
}
```

### Stops CRUD

| Method | Endpoint | Description | Status |
|---|---|---|---|
| `GET` | `/api/v1/stops` | List all stops | 200 |
| `GET` | `/api/v1/stops/:id` | Get stop by ID | 200 / 404 |
| `POST` | `/api/v1/stops` | Create a stop | 201 |
| `PUT` | `/api/v1/stops/:id` | Update a stop | 200 / 404 |
| `DELETE` | `/api/v1/stops/:id` | Delete a stop | 204 / 404 |

**Create body:**
```json
{
  "id": "s1",       // optional — auto-generated UUID if omitted
  "lat": 4.609,     // required — range: -90 to 90
  "lng": -74.081,   // required — range: -180 to 180
  "demand": 20,     // required — min: 0
  "priority": 5     // optional — default: 0
}
```

---

## Integrations

### gRPC — Route Optimizer

Connects to Python/VROOM optimizer via gRPC (Protocol Buffers).

- **Proto file:** [`src/grpc-client/proto/route-optimizer.proto`](src/grpc-client/proto/route-optimizer.proto)
- **Service:** `RouteOptimizer.SolveRoute`
- **Fallback:** When the optimizer is unavailable, the backend generates a **mock response** (round-robin stop assignment per vehicle) so development isn't blocked.

```protobuf
service RouteOptimizer {
  rpc SolveRoute (SolveRouteRequest) returns (SolveRouteResponse);
}
```

### Socket.io — Real-Time Gateway

Acts as a **Socket.io client** connecting to Socket.io server (gateway).

- **Event emitted:** `route-update`
- **Reconnection:** Auto-reconnect up to 10 attempts, 2s delay
- **Payload:**
```json
{
  "eventType": "new_order",
  "routes": [...],
  "totalCost": 100,
  "solvedAt": "2026-03-06T...",
  "emittedAt": "2026-03-06T..."
}
```

### n8n — Workflow Automation

n8n workflows send HTTP POST requests to `/api/v1/webhook` with logistics events. The backend processes them through the full pipeline (optimize → emit → respond).

---

## Testing

```bash
# Unit tests (46 tests across 9 suites)
npm test

# E2E tests (19 tests — health, webhook, vehicles CRUD, stops CRUD)
npm run test:e2e

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

### Test Coverage

| Suite | Tests | What it covers |
|---|---|---|
| `app.controller.spec` | 1 | Health endpoint |
| `webhook.controller.spec` | 3 | Webhook routing & delegation |
| `webhook.service.spec` | 3 | gRPC call, mock fallback, Socket.io emit |
| `grpc-client.service.spec` | 2 | gRPC client initialization & solveRoute |
| `socket-client.service.spec` | 3 | Connection status, emit behavior |
| `vehicles.controller.spec` | 5 | Vehicles CRUD via controller |
| `vehicles.service.spec` | 8 | Vehicles CRUD logic + 404 handling |
| `stops.controller.spec` | 5 | Stops CRUD via controller |
| `stops.service.spec` | 8 | Stops CRUD logic + 404 handling |
| **E2E** | **19** | Full HTTP pipeline with validation |

---

## Team

**Los Gavilanes del Código** — ARSW, Escuela Colombiana de Ingeniería

| Member | Responsibility |
|---|---|
| **Juan Sebastian Ortega** | NestJS Core Backend + Simple Map (this repo) |
| **Cristian** | VROOM Route Optimizer (Python, gRPC server) |
| **Elizabeth** | Socket.io Real-Time Gateway (Node.js) |
| **Andersson** | n8n Workflow Automation |

---

<div align="center">

*Sprint 1 — March 2026*

</div>
