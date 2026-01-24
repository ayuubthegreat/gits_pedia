import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth";
import { articlesReducer } from "./slices/articles";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        articles: articlesReducer,
    }
})
