import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import { publicApi } from "../api";


export default function Login() {
    const dispatch = useDispatch();
    const btnRef = useRef(null);
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    useEffect(() => {
        if (!window.google) return;

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (resp) => {
                try {
                    const { data } = await publicApi.post("/auth/google", { credential: resp.credential });
                    if (data?.ok) {
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        dispatch(loginSuccess(data.user));
                    }
                } catch {
                    alert("Login failed, please try again.");
                }
            },
        });

        window.google.accounts.id.renderButton(btnRef.current, {
            theme: "outline", size: "large", shape: "rectangular",
        });
    }, []);

    return (
        <main style={{ display:"grid", placeItems:"center", minHeight:"100vh" }}>
            <div>
                <h2>Sign in</h2>
                <div ref={btnRef} />
            </div>
        </main>
    );
}