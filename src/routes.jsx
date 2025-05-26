// src/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DonationsPage from "./pages/DonationsPage";
import NgoPanel from "./pages/NgoPanel";
import ProtectedRoute from "./components/protectedRoute";
import Layout from "./components/Layout"; // Import the layout
import DonorInfo from "./pages/DonorInfo";
import Community from "./pages/Community";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* No header for login and signup */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        

        {/* Header will be applied to all these routes */}
        <Route element={<Layout />}>
          <Route
            path="/donations"
            element={<ProtectedRoute><DonationsPage /></ProtectedRoute>}
          />
          <Route
            path="/ngo-panel"
            element={<ProtectedRoute><NgoPanel /></ProtectedRoute>}
          />
          {/* Add more pages here if needed */}
            <Route
            path="/donorsInfo"
            element={<ProtectedRoute><DonorInfo /></ProtectedRoute>}
          />
           <Route
            path="/community"
            element={<ProtectedRoute><Community /></ProtectedRoute>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
