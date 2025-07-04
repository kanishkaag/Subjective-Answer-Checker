import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RoleSelection } from './pages/RoleSelection';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { Auth } from './pages/Auth';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Score } from './pages/Score';
import { Login } from './pages/Login';
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/teacher" 
              element={
                
                  <TeacherDashboard />
                
              } 
            />
            <Route 
              path="/student" 
              element={
            
                  <StudentDashboard />
               
              } 
            />
            <Route 
              path="/score" 
              element={
            
                  <Score />
               
              } 
            />
            <Route 
              path="/login" 
              element={
            
                  <Login />
               
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

// rm -rf node_modules/.vite
// npm run dev
