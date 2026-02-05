# GumboBall App Design

## Architecture Overview

### Tech Stack
- **Backend**: Node.js with Express + WebSocket (using `socket.io`)
- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework)
- **Storage**: In-memory game state (no database needed)
- **Deployment**: LXC container on Proxmox (local network)

### System Architecture

```
┌─────────────────┐      WebSocket      ┌─────────────────┐
│  Gumbo Manager  │ ──────────────────▶ │   Node.js       │
│  (iPad browser) │                     │   Server        │
│                 │ ◀────────────────── │   (LXC)         │
│  - Start/End    │     "state update"  │                 │
│  - Enter dice   │                     │  Game State:    │
└─────────────────┘                     │  - streak       │
                                        │  - gumboStep    │
┌─────────────────┐      WebSocket      │  - gumboTimes   │
│  Gumbo Tally    │ ◀────────────────── │  - throwCount   │
│  (TV browser)   │     "state update"  │  - diceRolls    │
│                 │                     │  - etc...       │
│  - Display only │                     └─────────────────┘
│  - Auto-updates │
└─────────────────┘
```

## Pages

### 1. Gumbo Tally Page (`/tally`)
**Purpose**: Display-only page for casting to TV

**Features**:
- Uses `GumboBall Tally.svg` as background
- Real-time updates via WebSocket (no page refresh needed)
- Displays all game analytics overlaid on SVG
- No navigation or interactive elements

**Analytics Displayed**:
- Current streak count
- Current gumbo step (0-4) with visual highlighting
- Total gumbo times count
- Total throw count
- Hard throw percentage
- Max gumbo slams reached
- Average streak before rolling 7

**Visual Behavior**:
- **Step highlighting**: Cumulative green highlighting
  - Step 0: Nothing highlighted
  - Step 1: "ROUX" box highlighted green
  - Step 2: "2ND" box highlighted green
  - Step 3: "3RD" box highlighted green
  - Step 4: "4TH" box highlighted green
- **Optional**: Red flash on "SEVEN OUT" when a 7 is rolled

### 2. Gumbo Manager Page (`/manager`)
**Purpose**: Control interface for iPad

**Features**:
- **Start New Game** button: Resets all stats to 0, clears history
- **End Game** button: Stops tracking (no visual change)
- **Dice Input Interface**:
  - 2 columns × 3 rows of dice images
  - Left column: dice values 1, 3, 5 (top to bottom)
  - Right column: dice values 2, 4, 6 (top to bottom)
  - User taps one die from left column (highlights)
  - User taps one die from right column (highlights)
  - User presses "Enter" button below columns
  - Selection clears automatically after submit
  - Brief green flash on successful entry

**Layout**:
```
┌─────────────────────────────────┐
│     [Start New Game]            │
│                                 │
│  Left Column   Right Column     │
│  ┌─────┐       ┌─────┐         │
│  │  1  │       │  2  │         │
│  └─────┘       └─────┘         │
│  ┌─────┐       ┌─────┐         │
│  │  3  │       │  4  │         │
│  └─────┘       └─────┘         │
│  ┌─────┐       ┌─────┐         │
│  │  5  │       │  6  │         │
│  └─────┘       └─────┘         │
│                                 │
│        [Enter]                  │
│                                 │
│     [End Game]                  │
└─────────────────────────────────┘
```

## Design System

### Color Palette
- **Background**: `rgb(165, 110, 148)` - Purple/mauve
- **Primary Text**: `rgb(255, 227, 59)` - Yellow
- **Highlight (success)**: Green (for step highlighting and flash feedback)
- **Highlight (seven)**: Red (optional, for "SEVEN OUT" flash)
- **Stroke/Outline**: `rgb(165, 110, 148)` - Purple (from SVG)

### Typography
- **Titles/Headers**: Phosphate-Inline font
- **Stats/Numbers**: Futura-Bold font
- **Fallback**: If font loading fails, use Google Fonts alternatives

### Responsive Design
- Tally page: Full-screen, optimized for 16:9 TV display
- Manager page: Touch-friendly, optimized for iPad portrait/landscape

## WebSocket Events

### Client → Server
```javascript
{
  type: 'START_GAME'
}

{
  type: 'END_GAME'
}

{
  type: 'SUBMIT_DICE',
  payload: {
    die1: 1-6,
    die2: 1-6
  }
}
```

### Server → Client
```javascript
{
  type: 'STATE_UPDATE',
  payload: {
    streak: number,
    gumboStep: number,
    gumboTimes: number,
    throwCount: number,
    diceRolls: [{die1, die2}, ...],
    hardPercent: number,
    maxGumboSlams: number,
    avgStreak: number,
    gameActive: boolean
  }
}

{
  type: 'DICE_ACCEPTED'  // Confirmation for manager page
}

{
  type: 'ERROR',
  payload: {
    message: string
  }
}
```

## File Structure

```
gumboball/
├── server/
│   ├── index.js           # Express + Socket.io server
│   ├── gameState.js       # Game state management
│   └── package.json
├── public/
│   ├── tally.html         # Tally page
│   ├── manager.html       # Manager page
│   ├── css/
│   │   ├── tally.css
│   │   └── manager.css
│   ├── js/
│   │   ├── tally.js       # WebSocket client for tally
│   │   └── manager.js     # WebSocket client for manager
│   ├── fonts/
│   │   ├── Phosphate-Inline.woff2
│   │   └── Futura-Bold.woff2
│   └── assets/
│       ├── GumboBall Tally.svg
│       └── dice/          # Dice images for manager
│           ├── die-1.png
│           ├── die-2.png
│           ├── die-3.png
│           ├── die-4.png
│           ├── die-5.png
│           └── die-6.png
├── Dockerfile             # Docker image configuration
├── docker-compose.yml     # Docker Compose orchestration
├── .dockerignore          # Files to exclude from Docker build
├── package.json           # Root package.json for Docker build
├── GUMBOBALL.md
├── APPDESIGN.md
└── README.md
```

## Development Phases

### Phase 1: Server Setup
1. Initialize Node.js project
2. Set up Express server
3. Configure Socket.io
4. Implement game state management
5. Create WebSocket event handlers

### Phase 2: Tally Page
1. Create HTML structure
2. Embed SVG background
3. Position analytics overlays
4. Implement WebSocket client
5. Add step highlighting logic
6. Optional: Add "SEVEN OUT" flash animation

### Phase 3: Manager Page
1. Create HTML structure
2. Build dice selector interface
3. Implement touch/click handlers
4. Add WebSocket client
5. Implement feedback animations (flash, clear)
6. Add Start/End game buttons

### Phase 4: Testing & Deployment
1. Test on local network
2. Test real-time sync between pages
3. Test on iPad and TV
4. Deploy to LXC container
5. Configure network access

## Technical Considerations

### WebSocket Connection
- Auto-reconnect on disconnect
- Handle connection errors gracefully
- Show connection status on manager page

### Performance
- Minimal DOM updates (only changed values)
- Efficient SVG manipulation
- Debounce rapid dice submissions

### Browser Compatibility
- Target modern browsers (Chrome, Safari, Firefox)
- Test on iPad Safari specifically
- Ensure TV browser compatibility (likely Chrome/Chromium)

### Fonts
- Use `@font-face` for custom fonts
- Provide fallback fonts
- Preload fonts for faster rendering

## Docker Configuration

### Dockerfile
```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY server/ ./server/
COPY public/ ./public/

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server/index.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  gumboball:
    build: .
    container_name: gumboball-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    volumes:
      # Mount fonts directory if using custom fonts
      - ./public/fonts:/app/public/fonts:ro
```

### .dockerignore
```
node_modules
npm-debug.log
.git
.gitignore
*.md
!README.md
.DS_Store
*.afdesign
*.afdesign~lock~
```

## Deployment Notes

### LXC Container Setup
1. **Install Docker and Docker Compose** on the LXC container:
   ```bash
   # Update package list
   apt update
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   apt install docker-compose-plugin
   ```

2. **Clone or copy the project** to the LXC container:
   ```bash
   cd /opt
   git clone <your-repo> gumboball
   cd gumboball
   ```

3. **Build and start the application**:
   ```bash
   docker compose up -d --build
   ```

4. **Configure firewall** (if needed):
   ```bash
   # Allow port 3000
   ufw allow 3000/tcp
   ```

5. **Set up auto-start** (Docker Compose handles this with `restart: unless-stopped`)

6. **Configure static IP** on the LXC container for consistent access

### Docker Commands

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

### Access URLs
- Tally page: `http://<lxc-ip>:3000/tally`
- Manager page: `http://<lxc-ip>:3000/manager`

### Benefits of Docker Deployment
- ✅ Consistent environment across development and production
- ✅ Easy updates with `docker compose up -d --build`
- ✅ Automatic restart on failure or reboot
- ✅ Isolated from host system
- ✅ Simple rollback by rebuilding previous version
- ✅ No manual Node.js installation required
