import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import { publicApi } from "../api";

export default function Login() {
    const dispatch = useDispatch();
    const btnRef = useRef(null);
    const [gsiReady, setGsiReady] = useState(false);
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;


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


    useEffect(() => {
        if (!gsiReady || !btnRef.current || !GOOGLE_CLIENT_ID) return;

        // hot-reload
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
                    } else {
                        alert("Login failed. Please try again.");
                    }
                } catch (e) {
                    alert("Login failed. Please try again.");
                    console.error(e);
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
    }, [gsiReady, GOOGLE_CLIENT_ID]);

    return (
        <main style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
            <div>
                <h2 style={{ textAlign: "center" }}>Sign in</h2>
                {!GOOGLE_CLIENT_ID && (
                    <p style={{ color: "crimson", textAlign: "center" }}>
                        Missing variables..
                    </p>
                )}
                <div ref={btnRef} style={{ display: "flex", justifyContent: "center", marginTop: 12 }} />
            </div>
        </main>
    );
}