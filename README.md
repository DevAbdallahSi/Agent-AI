# AI-Powered Programming Education Platform

A comprehensive full-stack web application that teaches programming through AI voice agents, gamification, and hands-on learning.

## Features

- 🤖 **AI Voice Agent**: Multi-lingual voice teaching with real-time conversation
- 💻 **Interactive Code Editor**: Live coding practice with instant validation
- 🎮 **Gamification**: Levels, XP, badges, and learning streaks
- 🧠 **Algorithms Module**: Visual algorithm learning with complexity analysis
- 💬 **24/7 AI Chatbot**: Instant help with debugging and explanations
- 📊 **Visual Learning**: Interactive diagrams and animations
- 📱 **Responsive Design**: Works on mobile, tablet, and desktop
- 🌙 **Dark/Light Mode**: Full theme support with accessibility

## Tech Stack

### Frontend (Client)
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Monaco Editor for code editing
- Web Speech API for voice features

### Backend (Server)
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT authentication
- OpenAI API integration
- Speech-to-text and text-to-speech APIs

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ai-programming-education-platform
```

### 2. Install Dependencies

#### Install Client Dependencies
```bash
cd client
npm install
```

#### Install Server Dependencies
```bash
cd ../server
npm install
```

### 3. Environment Setup

#### Client Environment (.env in client folder)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

#### Server Environment (.env in server folder)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-education-platform
JWT_SECRET=your-super-secret-jwt-key-here
OPENAI_API_KEY=your-openai-api-key-here
CLIENT_URL=http://localhost:3000
```

### 4. Database Setup
Make sure MongoDB is running on your system:
```bash
# For macOS with Homebrew
brew services start mongodb-community

# For Ubuntu/Debian
sudo systemctl start mongod

# For Windows
net start MongoDB
```

### 5. Run the Application

#### Start the Server (Terminal 1)
```bash
cd server
npm run dev
```

#### Start the Client (Terminal 2)
```bash
cd client
npm run dev
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
ai-programming-education-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get specific lesson
- `POST /api/lessons/:id/complete` - Mark lesson as complete

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress/xp` - Add XP points
- `POST /api/progress/badge` - Award badge

### AI Services
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/voice` - Voice interaction
- `POST /api/ai/code-review` - Code review and validation

## Development

### Available Scripts

#### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Server
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript
- `npm start` - Start production server

## Deployment

### Frontend (Netlify/Vercel)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist` folder to your hosting service

### Backend (Railway/Heroku/DigitalOcean)
1. Set environment variables on your hosting platform
2. Deploy the server folder
3. Ensure MongoDB is accessible from your hosting environment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details