import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {articleFailure, articleSuccess, loadingCase } from "../utils";
import { APICall } from "../api";
import { BASE_URL_API } from "../../GENERAL_INFO";

export const initialState = {
    articles: [],
    loading: false,
    error: null,
    searchQuery: "",
    currentArticle: null, // For viewing or editing a specific article
}
const BASE_URL_ARTICLES = "/wiki/articles";

export const fetchArticles = createAsyncThunk(
    "articles/fetchArticles",
    async (params, { rejectWithValue }) => {
        const result = await APICall("get", `${BASE_URL_ARTICLES}/getArticles`, params, localStorage.getItem("token"));
        if (result.error) {
            return rejectWithValue(result.error);
        }
        return result.data;
    }
)
// Create Article Thunk (data will include title, content, infobox, references, etc.)
export const createArticle = createAsyncThunk(
    "articles/createArticle",
    async (data, { rejectWithValue }) => {
        console.log("Creating article with data:", data);
        const result = await APICall("post", `${BASE_URL_ARTICLES}/createArticle`, data, localStorage.getItem("token"));
        if (result.error) {
            return rejectWithValue(result.error);
        }
        console.log("Created article result:", result);
        return result.data;
    }
)
export const editArticle = createAsyncThunk(
    "articles/editArticle",
    async ( {id, data}, { rejectWithValue }) => {
        data.articleID = id;
        const result = await APICall("post", `${BASE_URL_ARTICLES}/editArticle`, data, localStorage.getItem("token"));
        if (result.error) {
            return rejectWithValue(result.error);
        }
        console.log("Edited article result:", result);
        return result.data;
    }
)
export const deleteArticle = createAsyncThunk(
    "articles/deleteArticle",
    async (id, { rejectWithValue }) => {
        const result = await APICall("post", `${BASE_URL_ARTICLES}/deleteArticle/${id}`, null, localStorage.getItem("token"));
        if (result.error) {
            return rejectWithValue(result.error);
        }
        return result.data;
    }
)
export const slice = createSlice({
    name: "articles",
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            console.log("Search Query set to:", state.searchQuery);
        },
        setCurrentArticle: (state, action) => {
            state.currentArticle = action.payload;
            console.log("Current Article set to:", state.currentArticle);
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchArticles.pending, loadingCase)
        .addCase(fetchArticles.fulfilled, articleSuccess)
        .addCase(fetchArticles.rejected, articleFailure)
        .addCase(createArticle.pending, loadingCase)
        .addCase(createArticle.fulfilled, articleSuccess)
        .addCase(createArticle.rejected, articleFailure)
        .addCase(editArticle.pending, loadingCase)
        .addCase(editArticle.fulfilled, articleSuccess)
        .addCase(editArticle.rejected, articleFailure)
        .addCase(deleteArticle.pending, loadingCase)
        .addCase(deleteArticle.fulfilled, articleSuccess)
        .addCase(deleteArticle.rejected, articleFailure);
    }
})
// Reducer
export const { setSearchQuery, setCurrentArticle } = slice.actions;
export const articlesReducer = slice.reducer;