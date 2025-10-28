import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import { publicApi } from "../api";
import "./Login.css";
import { closeLoginModal } from "../features/uxSlice.js";

export default function LoginModal() {
    const dispatch = useDispatch();
    const btnRef = useRef(null);
    const [gsiReady, setGsiReady] = useState(false);
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const closeModal = () => dispatch(closeLoginModal());

    // Load GSI script once
    useEffect(() => {
        if (window.google?.accounts?.id) {
            setGsiReady(true);
            return;
        }
        let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (!script) {
            script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
        const onLoad = () => setGsiReady(true);
        script.addEventListener("load", onLoad);
        return () => script.removeEventListener("load", onLoad);
    }, []);

    // Initialize and render GSI button when ready
    useEffect(() => {
        if (!gsiReady || !btnRef.current || !GOOGLE_CLIENT_ID) return;

        // avoid duplicates on hot-reload
        btnRef.current.innerHTML = "";

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (resp) => {
                try {
                    const { data } = await publicApi.post("/auth/google", { credential: resp.credential });
                    if (data?.ok) {
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        dispatch(loginSuccess(data.user));
                        closeModal(); // close via Redux on success
                    } else {
                        alert("Login failed. Please try again.");
                    }
                } catch (e) {
                    console.error(e);
                    alert("Login failed. Please try again.");
                }
            },
        });

        window.google.accounts.id.renderButton(btnRef.current, {
            theme: "outline",
            size: "large",
            shape: "rectangular",
            text: "signin_with",
        });

        window.google.accounts.id.prompt();

        return () => {
            if (btnRef.current) btnRef.current.innerHTML = "";
        };
    }, [gsiReady, GOOGLE_CLIENT_ID, dispatch]);

    return (
        <div className="login-overlay" aria-hidden="true" onClick={closeModal}>
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-title"
                className="login-modal"
                onClick={(e) => e.stopPropagation()} // prevent overlay close when clicking inside
            >
                <header className="login-header">
                    <h2 id="login-title" className="login-title">Sign in</h2>
                </header>

                {!GOOGLE_CLIENT_ID && (
                    <p className="login-warning">
                        Missing VITE_GOOGLE_CLIENT_ID. Add it to your .env and restart dev server.
                    </p>
                )}

                <div ref={btnRef} className="login-button-wrap" />
            </section>
        </div>
    );
}