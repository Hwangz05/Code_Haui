import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ROUTES } from './config/routes.config';

// Layouts
import Layout from './components/layout/Layout/Layout';
import TeacherLayout from './components/layout/TeacherLayout/TeacherLayout';

// Student pages
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/Home/HomePage';
import KhoaHocPage from './pages/KhoaHoc/KhoaHocPage';
import KhoaHocDetailPage from './pages/KhoaHocDetail/KhoaHocDetailPage';
import ThiDauPage from './pages/ThiDau/ThiDauPage';
import ThiDauDetailPage from './pages/ThiDauDetail/ThiDauDetailPage';
import LeaderboardPage from './pages/Leaderboard/LeaderboardPage';
import ProfilePage from './pages/Profile/ProfilePage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

// Teacher pages
import TeacherClassesPage from './pages/TeacherClasses/TeacherClassesPage';
import TeacherProblemsPage from './pages/TeacherProblems/TeacherProblemsPage';
import TeacherAnalyticsPage from './pages/TeacherAnalytics/TeacherAnalyticsPage';
import TeacherStudentDetailPage from './pages/TeacherStudentDetail/TeacherStudentDetailPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />

          {/* Teacher portal — uses TeacherLayout (sidebar + topbar) */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<Navigate to="/teacher/students" replace />} />
            <Route path="students" element={<TeacherClassesPage />} />
            <Route path="problems" element={<TeacherProblemsPage />} />
            <Route path="analytics" element={<TeacherAnalyticsPage />} />
            <Route path="classes" element={<Navigate to="/teacher/students" replace />} />
            <Route path="dashboard" element={<Navigate to="/teacher/students" replace />} />
            <Route path="students/:studentId" element={<TeacherStudentDetailPage />} />
          </Route>

          {/* Student area — uses main Layout with Header/Footer */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to={ROUTES.HOME} replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="khoa-hoc" element={<KhoaHocPage />} />
            <Route path="khoa-hoc/:id" element={<KhoaHocDetailPage />} />
            <Route path="thi-dau" element={<ThiDauPage />} />
            <Route path="thi-dau/:slug" element={<ThiDauDetailPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}