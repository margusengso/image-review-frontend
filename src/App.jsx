import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loginSuccess, logout } from "./features/authSlice";
import { privateApi } from "./api";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
    const user = useSelector(s => s.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const u = localStorage.getItem("user");
        const t = localStorage.getItem("token");
        if (u && t) {
            privateApi.get("/me")
                .then(() => dispatch(loginSuccess(JSON.parse(u))))
                .catch(() => { localStorage.clear(); dispatch(logout()); });
        }
    }, []);

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}