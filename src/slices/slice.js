import { createAsyncThunk } from "@reduxjs/toolkit";
import { Thunk } from "../functions/funcs";


export const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    articles: null
}



export const login = Thunk("post", "auth/login", false);
export const register = Thunk("post", "auth/register", false)
