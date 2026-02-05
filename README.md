# GumboBall

A real-time dice game with WebSocket-powered tally display.

## Overview

GumboBall is a dice game where players try to avoid rolling a sum of 7. The goal is to achieve consecutive successful rolls to earn "Gumbo Times" and build up streaks.

## Features

- **Real-time Updates**: WebSocket communication ensures instant updates across all connected devices
- **Dual Interface**: 
  - **Tally Page**: Display-only page optimized for TV casting
  - **Manager Page**: Interactive control interface for iPad
- **Beautiful Design**: Custom SVG background with dynamic analytics overlay
- **Docker Support**: Easy deployment with Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Local network access

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gumboball
```

2. Build and start the application:
```bash
docker compose up -d --build
```

3. Access the pages:
- **Tally Page** (for TV): `http://localhost:3000/tally`
- **Manager Page** (for iPad): `http://localhost:3000/manager`

## Development

### Run without Docker

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Game Rules

1. Players roll two dice and enter the values
2. If the sum **does NOT equal 7**: the roll is successful
3. If the sum **equals 7**: the current round ends (streak resets)
4. After **4 consecutive successful rolls**, earn 1 "Gumbo Time"
5. Game continues until "End Game" is pressed

## Analytics Tracked

- **Streak**: Current consecutive successful rolls
- **Gumbo Step**: Progress toward next Gumbo Time (0-4)
- **Gumbo Times**: Total Gumbo Times earned
- **Throw Count**: Total dice throws
- **Hard %**: Percentage of doubles rolled
- **Max Gumbo Slams**: Highest Gumbo Times before rolling a 7
- **Avg. Streak**: Average throws before rolling a 7

## Docker Commands

```bash
# Start the application
docker compose up -d

# Stop the application
docker compose down

# View logs
docker compose logs -f

# Rebuild after code changes
docker compose up -d --build

# Restart the application
docker compose restart
```

## Project Structure

```
gumboball/
├── server/              # Node.js backend
│   ├── index.js        # Express + Socket.io server
│   └── gameState.js    # Game logic
├── public/             # Frontend files
│   ├── tally.html      # Tally page
│   ├── manager.html    # Manager page
│   ├── css/            # Stylesheets
│   ├── js/             # Client-side JavaScript
│   └── assets/         # Images and SVG
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Technology Stack

- **Backend**: Node.js, Express, Socket.io
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Deployment**: Docker & Docker Compose
- **Real-time**: WebSocket (Socket.io)

## License

MIT

## Documentation

- [GUMBOBALL.md](./GUMBOBALL.md) - Complete game rules and logic
- [APPDESIGN.md](./APPDESIGN.md) - Technical architecture and design
