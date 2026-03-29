import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import RoleGuard from './components/RoleGuard'
import { useAuth } from './context/AuthContext'
import DashboardLayout from './layouts/DashboardLayout'
import AdminCoursesPage from './pages/AdminCoursesPage'
import AdminUsersPage from './pages/AdminUsersPage'
import CourseDetailPage from './pages/CourseDetailPage'
import CoursesPage from './pages/CoursesPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import InstructorCreateCoursePage from './pages/InstructorCreateCoursePage'
import InstructorMyCoursesPage from './pages/InstructorMyCoursesPage'
import LibraryPage from './pages/LibraryPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1 py-8 sm:py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route path="/home" element={<Navigate to="/" replace />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/library" element={<LibraryPage />} />

              <Route element={<RoleGuard allowedRoles={["admin"]} />}>
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/courses" element={<AdminCoursesPage />} />
              </Route>

              <Route element={<RoleGuard allowedRoles={["instructor"]} />}>
                <Route
                  path="/instructor/create-course"
                  element={<InstructorCreateCoursePage />}
                />
                <Route
                  path="/instructor/my-courses"
                  element={<InstructorMyCoursesPage />}
                />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
