import axios from "axios";
import store from "./store";
import { logout } from "./features/authSlice";

export const publicApi = axios.create({ baseURL: "/api" });
export const privateApi = axios.create({ baseURL: "/api" });

privateApi.interceptors.request.use(cfg => {
    const token = localStorage.getItem("token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

privateApi.interceptors.response.use(
    r => r,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            store.dispatch(logout());
            window.location.href = "/";
        }
        return Promise.reject(err);
    }
);