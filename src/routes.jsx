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
import MyMatchesPage from "./pages/MyMatchesPage";
import FAQPage from "./pages/FAQPage";
import BlogPage from "./pages/BlogPage";
import VerifyOtp from "./pages/VerifyOtp";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ChatPage from "./pages/ChatPage";
import VerificationPage from "./pages/VerificationPage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminPanel from "./pages/AdminPanel";
import FavoritesPage from "./pages/FavoritesPage";
import TermsConditions from "./pages/TermsConditions";
import HoroscopePage from "./pages/HoroscopePage";
import VideoCallPage from "./pages/VideoCallPage";
import EventsPage from "./pages/EventsPage";
import InterestsTabView from "./components/InterestsTabView"
import MatchesList from "./components/MatchesList";
// import PrivacyPolicy from "./pages/PrivacyPolicy";

// Protected routes array - यहाँ सभी protected routes डालें
const protectedRoutes = [
  // { path: "/profile", component: () => { window.location.href = '/matches'; return null; } },
  { path: "/profile", component: Profile },
  { path: "/success-stories", component: SuccessStories },
  { path: "/membership", component: Membership },
  { path: "/payment-success", component: PaymentSuccessPage },
  { path: "/matches", component: MyMatchesPage },
  { path: "/chat", component: ChatPage },
  { path: "/verification", component: VerificationPage },
  { path: "/notifications", component: NotificationsPage },
  { path: "/favorites", component: FavoritesPage },
  { path: "/horoscope", component: HoroscopePage },
  { path: "/video-call/:userId", component: VideoCallPage },
  { path: "/events", component: EventsPage },
  { path: "/admin", component: AdminPanel },
  {path:"/shortlisted",component:InterestsTabView},
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
  { path: "/blog", component: BlogPage },
  { path: "/terms-condition", component: TermsConditions },
  // { path: "/privacy-policy", component: PrivacyPolicy },
];

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {publicRoutes.map((route) => {
          const Component = route.component;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<Component />}
            />
          );
        })}

        {/* Protected Routes */}
        {protectedRoutes.map((route) => {
          const Component = route.component;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute>
                  <Component />
                </ProtectedRoute>
              }
            />
          );
        })}

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