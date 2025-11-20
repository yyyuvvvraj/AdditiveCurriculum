import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/app/page";
import Login from "@/app/Login/page";
import Dashboard from "@/app/dashboard/page";
import Inventory from "@/app/Inventory/page";
import PartDetails from "@/app/PartDetails/page";
import Machines from "@/app/Machines/page";
import Consumption from "@/app/Consumption/page";
import AlertsPage from "@/app/AlertsPage/page";
import Admin from "@/app/Admin/page";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="" element={<Dashboard />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="inventory/:id" element={<PartDetails />} />
                <Route path="machines" element={<Machines />} />
                <Route path="consumption" element={<Consumption />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="admin" element={<Admin />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
