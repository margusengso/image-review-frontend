import { configureStore } from "@reduxjs/toolkit";
import auth from "./features/authSlice";
import ux from "./features/uxSlice.js";
const store = configureStore({ reducer: { auth, ux } });
export default store;