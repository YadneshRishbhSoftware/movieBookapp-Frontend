// App.tsx
import AuthWrapper from './components/AuthWrapper';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme/theme';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import SeatBooking from './pages/SeatBooking';
import BookuserInfo from './pages/BookuserInfo';
import Forgotpassword from './pages/Forgotpassword';
import ResetPassword from './pages/ResetPassword';
import Emailverification from './pages/Emailverification';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <AuthWrapper isPublic>
                <LoginPage />
              </AuthWrapper>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthWrapper isPublic>
                <RegisterPage />
              </AuthWrapper>
            } 
          />
             <Route 
            path="/email-verification" 
            element={
              <AuthWrapper isPublic>
                <Emailverification />
              </AuthWrapper>
            } 
          />
          <Route 
            path="/forgotPassword" 
            element={
              <AuthWrapper isPublic>
                <Forgotpassword />
              </AuthWrapper>
            } 
          />
          <Route 
            path="/resetPassword/:token" 
            element={<ResetPassword />} 
          />

          {/* Protected Admin Routes */}
          <Route 
            path="/movieList" 
            element={
              <AuthWrapper requiredRole="admin">
                <DashboardPage />
              </AuthWrapper>
            } 
          />

          {/* Protected User Routes */}
          <Route 
            path="/user" 
            element={
              <AuthWrapper requiredRole="user">
                <UserDashboardPage />
              </AuthWrapper>
            }
          />
          <Route 
            path="/seatBooking" 
            element={
              <AuthWrapper requiredRole="user">
                <SeatBooking />
              </AuthWrapper>
            } 
          />
          <Route 
            path="/bookuserInfo" 
            element={
              <AuthWrapper requiredRole="user">
                <BookuserInfo />
              </AuthWrapper>
            } 
          />

          {/* Default Route */}
          <Route 
            path="/" 
            element={
              <AuthWrapper isPublic>
                <LoginPage />
              </AuthWrapper>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;