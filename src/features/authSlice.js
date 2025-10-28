import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
    name: "auth",
    initialState: { user: null },
    reducers: {
        loginSuccess: (state, action) => { state.user = action.payload; },
        logout: (state) => { state.user = null; },
    }
});
export const { loginSuccess, logout } = slice.actions;
export default slice.reducer;