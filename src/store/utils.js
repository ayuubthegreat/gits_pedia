// Shared reducer cases and utilities
export const loadingCase = (state) => {
    state.loading = true;
    state.error = null;
}

export const userSuccess = (state, action) => {
    state.loading = false;
    state.user = action.payload.data.user;
    state.token = action.payload.data.token;
    localStorage.setItem("token", action.payload.data.token);
    state.error = null;
    console.log(state.loading, state.user, state.error, action.payload);
}

export const userFailure = (state, action) => {
    state.loading = false;
    state.user = null;
    state.error = action.payload;
}

export const articleSuccess = (state, action) => {
    state.loading = false;
    state.articles = action.payload.data.articles;
    state.error = null;
    console.log("Articles fetched successfully:", state.articles);
}
export const articleFailure = (state, action) => {
    state.loading = false;
    state.articles = [];
    state.error = action.payload;
}

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectLoading = (state) => state.auth.loading;
export const selectError = (state) => state.auth.error;
