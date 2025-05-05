import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar       from './components/Navbar';
import FeedPage     from './pages/FeedPage';
import ProfilePage  from './pages/ProfilePage';
import SearchPage   from './pages/SearchPage';
import PostPage     from './pages/PostPage';
import UserPage     from './pages/UserPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage    from './pages/LoginPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/feed"      element={<FeedPage />} />
            <Route path="/profile"   element={<ProfilePage />} />
            <Route path="/search"    element={<SearchPage />} />
            <Route path="/post/:id"  element={<PostPage />} />
            <Route path="/user/:id"  element={<UserPage />} />
            <Route path="/register"  element={<RegisterPage />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/"          element={<Navigate to="/feed" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
