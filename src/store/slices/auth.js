import { userSuccess, userFailure, loadingCase } from "../utils"; 
import { APICall, postData } from "../api";
import { BASE_URL_API } from "../../GENERAL_INFO";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

 export const initialState = {
    user: null,
    loading: false,
    error: null,
    token: localStorage.getItem("token") || null
    }

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (data, { rejectWithValue }) => {
        const result = await postData(data, "/auth/login");
        if (result.error) {
            return rejectWithValue(result.error);
        }
        return result.data;
    }
)
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (data, { rejectWithValue }) => {
        const result = await postData(data, "/auth/register");
        if (result.error) {
            return rejectWithValue(result.error);
        }
        return result.data;
    }
)
export const fetchUserInfo = createAsyncThunk(
    "auth/fetchUserInfo",
    async (token, { rejectWithValue }) => {

        const result = await APICall("get", "/auth/me", null, token);
        if (result.error) {
            return rejectWithValue(result.error);
        }
        return result.data;
    }
)
export const findUserByID = createAsyncThunk(
    "auth/findUserByID",
    async (id, { rejectWithValue }) => {
        const result = await APICall("get", "/auth/user/", {userID: id});
        if (result.error) {
            return rejectWithValue(result.error);
        }
        return result.data;
    }
)

export const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, loadingCase)
        .addCase(loginUser.fulfilled, userSuccess)
        .addCase(loginUser.rejected, userFailure)
        builder
        .addCase(registerUser.pending, loadingCase)
        .addCase(registerUser.fulfilled, userSuccess)
        .addCase(registerUser.rejected, userFailure);
        builder
        .addCase(fetchUserInfo.pending, loadingCase)
        .addCase(fetchUserInfo.fulfilled, userSuccess)
        .addCase(fetchUserInfo.rejected, userFailure);
        builder
        .addCase(findUserByID.pending, loadingCase)
        .addCase(findUserByID.fulfilled, userSuccess)
        .addCase(findUserByID.rejected, userFailure);
    }
})
export const { logout } = slice.actions;
// Selectors
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Reducer
export const authReducer = slice.reducer;
