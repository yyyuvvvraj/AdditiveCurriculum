// src/app/admin/page.tsx
"use client";
import React from "react";
import RequireAuth from "@/components/RequireAuth";
import AdminGuard from "@/components/AdminGuard";
import AdminContent from "@/components/AdminContent";

export default function AdminPage() {
  return (
   
      <AdminGuard>
        <AdminContent />
      </AdminGuard>
    
  );
}
