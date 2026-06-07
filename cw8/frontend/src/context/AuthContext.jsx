import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, clearToken, getToken, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }

        apiFetch("/api/auth/me")
            .then((data) => setUser(data.user))
            .catch(() => clearToken())
            .finally(() => setLoading(false));
    }, []);

    async function login(email, password) {
        const data = await apiFetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        setToken(data.token);
        setUser(data.user);
        return data.user;
    }

    async function register(email, password) {
        const data = await apiFetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        setToken(data.token);
        setUser(data.user);
        return data.user;
    }

    async function logout() {
        try {
            await apiFetch("/api/auth/logout", { method: "POST" });
        } catch {
            // token may already be invalid
        }
        clearToken();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
