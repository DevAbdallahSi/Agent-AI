import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { AIProvider } from './contexts/AIContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Algorithms from './pages/Algorithms';
import VisualLearning from './pages/VisualLearning';
import Chatbot from './components/AI/Chatbot';
import VoiceAgent from './components/AI/VoiceAgent';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <UserProvider>
        <AIProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              
              <div className="flex">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                
                <main className="flex-1 lg:ml-64">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/lessons" element={<Lessons />} />
                    <Route path="/lessons/:id" element={<LessonDetail />} />
                    <Route path="/algorithms" element={<Algorithms />} />
                    <Route path="/visual-learning" element={<VisualLearning />} />
                  </Routes>
                </main>
              </div>

              <VoiceAgent />
              <Chatbot />
            </div>
          </Router>
        </AIProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;