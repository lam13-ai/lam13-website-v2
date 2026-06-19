import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Loader2, LogOut, Database, KeyRound } from "lucide-react";

import { getAuth, getAccessToken, clearAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

type AccessState = "checking" | "granted" | "denied";

/**
 * Shared chrome + auth guard for every admin page. Verifies the signed-in user is an allow-listed admin
 * (via /admin/verify) once, renders the page nav + sign-out, and routes its children through <Outlet />.
 * Unauthenticated/denied users are sent to /admin/login.
 */
const AdminLayout = () => {
  const navigate = useNavigate();
  const [access, setAccess] = useState<AccessState>("checking");
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    if (!getAuth()) {
      navigate("/admin/login");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${BACKEND_API_URL}/admin/verify`, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAdminEmail(data?.email ?? getAuth()?.email ?? "");
          setAccess("granted");
        } else {
          setAccess("denied");
        }
      } catch {
        setAccess("denied");
      }
    })();
  }, [navigate]);

  const signOut = () => {
    clearAuth();
    navigate("/admin/login");
  };

  if (access === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (access === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>Not authorized</CardTitle>
            <CardDescription>
              Your account does not have access to the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={signOut}>
              Back to sign-in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Admin Panel</span>
            <nav className="ml-2 flex items-center gap-1">
              <NavLink to="/admin" end className={navClass}>
                <Database className="h-4 w-4" /> Knowledge Base
              </NavLink>
              <NavLink to="/admin/api-keys" className={navClass}>
                <KeyRound className="h-4 w-4" /> API Keys
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{adminEmail}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
