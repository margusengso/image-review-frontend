import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loginSuccess, logout } from "./features/authSlice";
import { privateApi } from "./api";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header.jsx";
import {closeLoginModal, setMainClick} from "./features/uxSlice.js";
import Homework from "./pages/Homework.jsx";

export default function App() {
    const user = useSelector(s => s.auth.user);
    const dispatch = useDispatch();
    const loginOpen = useSelector(state => state.ux.loginOpen)
    const navigate = useNavigate();

    useEffect(() => {
        const local_stored_user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (local_stored_user && token) {
            privateApi.get("/me")
                .then(() => {
                    dispatch(loginSuccess(JSON.parse(local_stored_user)))
                })
                .catch(() => {
                    localStorage.clear();
                    dispatch(logout());
                });
        }
    }, []);

    const closeMenu= () => { dispatch(setMainClick()) }

    useEffect(() => {
        if (user) {
            dispatch(closeLoginModal())
            navigate('/dashboard');
        }
    }, [user]);

    return (
        <div className="app">
            <Header/>
            <main onClick={closeMenu}>
                {loginOpen && <Login />
                }
                <Routes>
                    <Route path="/" element={<Homework/>} />
                    <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>

        </div>

    );
}