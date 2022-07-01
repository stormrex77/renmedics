import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import postReducer from "./features/post";
/*import commentReducer from "./features/comment";
import userReducer from "./features/user";*/
import { api } from "./features/api";

/*export default configureStore({
    reducer: {        
        post: postReducer,
        comment: commentReducer,
        user: userReducer,
        [api.reducerPath]: api.reducer
    },    
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
});*/

export function setUpStore(){
    const store = configureStore({
        reducer: {
            post: postReducer,
            [api.reducerPath]: api.reducer
        },
        middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
    });

    setupListeners(store.dispatch);
    return store;
}

const store = setUpStore();

export default store;