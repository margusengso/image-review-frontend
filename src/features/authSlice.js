import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
    name: "auth",
    initialState: { user: null },
    reducers: {
        loginSuccess: (s, a) => { s.user = a.payload; },
        logout: (s) => { s.user = null; },
    }
});
export const { loginSuccess, logout } = slice.actions;
export default slice.reducer;