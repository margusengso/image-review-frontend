import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
    name: "ux",
    initialState: {
        loginOpen: false,
        mainClick: 0
    },
    reducers: {
        toggleLoginModal: (state, action) => {state.loginOpen = !state.loginOpen},
        closeLoginModal: (state, action) => {state.loginOpen = false},
        setMainClick: (state, action) => {state.mainClick = new Date().getTime()}
    }
});

export const { toggleLoginModal, setMainClick, closeLoginModal } = slice.actions;
export default slice.reducer;
