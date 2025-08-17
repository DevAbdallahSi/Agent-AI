# AI-Powered Programming Education Platform (Frontend Only)

A modern frontend application that teaches programming through direct OpenRouter AI integration, gamification, and hands-on learning.

## Features

- 🤖 **OpenRouter AI Chat**: Direct integration with Claude, GPT-4, and other AI models
- 💻 **Interactive Code Editor**: Live coding practice with instant validation
- 🎮 **Gamification**: Levels, XP, badges, and learning streaks
- 🧠 **Algorithms Module**: Visual algorithm learning with complexity analysis
- 💬 **24/7 AI Assistant**: Instant help with debugging and explanations via OpenRouter
- 📊 **Visual Learning**: Interactive diagrams and animations
- 📱 **Responsive Design**: Works on mobile, tablet, and desktop
- 🌙 **Dark/Light Mode**: Full theme support with accessibility

## Tech Stack

### Frontend Only
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Monaco Editor for code editing
- OpenRouter API for AI chat functionality

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- OpenRouter API key (get one at https://openrouter.ai/)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ai-programming-education-platform/client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup

#### Environment (.env file)
```env
VITE_OPENROUTER_API_KEY=your-openrouter-api-key-here
```

### 4. Run the Application
```bash
npm run dev
```

### 5. Access the Application
- Application: http://localhost:3000

## Project Structure

```
client/
├── src/
│   ├── components/        # Reusable components
│   │   ├── AI/           # AI chat components
│   │   ├── Layout/       # Layout components
│   │   └── UI/           # UI components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── public/               # Static assets
└── README.md
```

## OpenRouter Integration

The platform uses OpenRouter API to provide access to multiple AI models:
- **Claude 3.5 Sonnet** (default) - Excellent for programming help
- **GPT-4** - Great for explanations and debugging
- **Other models** - Easily configurable

### Supported Features:
- Real-time AI chat for programming help
- Code review and debugging assistance
- Algorithm explanations
- Step-by-step learning guidance
- Multi-turn conversations with context

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

### Deploy to Netlify/Vercel
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Set your `VITE_OPENROUTER_API_KEY` environment variable

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details