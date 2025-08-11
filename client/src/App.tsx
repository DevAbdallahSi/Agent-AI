import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { AIProvider } from './contexts/AIContext'
import { SocketProvider } from './contexts/SocketContext'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import Lessons from './pages/Lessons'
import LessonDetail from './pages/LessonDetail'
import Algorithms from './pages/Algorithms'
import AlgorithmDetail from './pages/AlgorithmDetail'
import VisualLearning from './pages/VisualLearning'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <AIProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="lessons" element={<Lessons />} />
                  <Route path="lessons/:id" element={<LessonDetail />} />
                  <Route path="algorithms" element={<Algorithms />} />
                  <Route path="algorithms/:id" element={<AlgorithmDetail />} />
                  <Route path="visual-learning" element={<VisualLearning />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Routes>
            </Router>
          </AIProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App