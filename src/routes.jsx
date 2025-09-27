import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import SuccessStories from "./pages/SuccessStories";
import Membership from "./pages/Membership";
import ContactUs from "./pages/ContactUs";
import PartnerMatchesPage from "./pages/PartnerMatchesPage";
import FAQPage from "./pages/FAQPage";
import SearchPage from "./pages/SearchPage";
import BlogPage from "./pages/BlogPage";
import VerifyOtp from "./pages/VerifyOtp";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ChatPage from "./pages/ChatPage";
import VerificationPage from "./pages/VerificationPage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminPanel from "./pages/AdminPanel";
import FavoritesPage from "./pages/FavoritesPage";

// Protected routes array - यहाँ सभी protected routes डालें
const protectedRoutes = [
  { path: "/profile", component: Profile },
  { path: "/success-stories", component: SuccessStories },
  { path: "/membership", component: Membership },
  { path: "/payment-success", component: PaymentSuccessPage },
  { path: "/matches", component: PartnerMatchesPage },
  { path: "/search-match", component: SearchPage },
  { path: "/chat", component: ChatPage },
  { path: "/verification", component: VerificationPage },
  { path: "/notifications", component: NotificationsPage },
  { path: "/favorites", component: FavoritesPage },
  { path: "/admin", component: AdminPanel }
];

// Public routes array
const publicRoutes = [
  { path: "/", component: HomePage },
  { path: "/about", component: About },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/verify-otp", component: VerifyOtp },
  { path: "/reset-password", component: ResetPassword },
  { path: "/contact-us", component: ContactUs },
  { path: "/faq", component: FAQPage },
  { path: "/blog", component: BlogPage }
];

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        {publicRoutes.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={<route.component />} 
          />
        ))}
        
        {/* Protected Routes */}
        {protectedRoutes.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={
              <ProtectedRoute>
                <route.component />
              </ProtectedRoute>
            } 
          />
        ))}

        {/* 404 - Page Not Found */}
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: "center", marginTop: "50px" }}>
              404 - Page Not Found
            </h2>
          }
        />
      </Route>
    </Routes>
  );
}