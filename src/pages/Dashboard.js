import React from "react";
import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import MemberDashboard from "./MemberDashboard";

export default function Dashboard({ userRole }) {
  if (userRole === "Admin") return <AdminDashboard />;
  if (userRole === "Manager") return <ManagerDashboard />;
  return <MemberDashboard />;
}
