import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { privateApi } from "../api";

export default function Dashboard() {
    const user = useSelector(s => s.auth.user);
    const dispatch = useDispatch();

    const checkToken = async () => {
        try { await privateApi.get("/me"); alert("Token OK"); }
        catch { /* handled by interceptor */ }
    };

    return (
        <main style={{ padding:20, fontFamily:"sans-serif" }}>
            <header style={{ display:"flex", alignItems:"center", gap:12 }}>
                {user?.picture && <img src={user.picture} width="48" height="48" style={{borderRadius:"50%"}} />}
                <div>{user?.given_name} {user?.family_name}</div>
                <button style={{ marginLeft:"auto" }} onClick={() => { localStorage.clear(); dispatch(logout()); }}>
                    Logout
                </button>
            </header>
            <button style={{ marginTop:16 }} onClick={checkToken}>Check token</button>
        </main>
    );
}