import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useTmdbAPI } from "../Store/API";

export default function ProtectAuth() {
  const location = useLocation();
  const { isLogin } = useTmdbAPI();

  return isLogin ? (
    <Outlet />
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
  );
}

export function ProtectLoginAuth() {
  const location = useLocation();
  const { isLogin } = useTmdbAPI();

  return isLogin ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
}
