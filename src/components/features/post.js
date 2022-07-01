import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    status: 'idle',
    error: null
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action){
                state.posts = [];
                state.posts.push(action.payload);
            },
            prepare(id, title, content, cover, user, date){
                return {
                    payload: {
                        id: id,
                        title, content, cover, user,
                        date
                    }
                }
            }
        },

        postLiked: {
            reducer(state, action){
                const { id, user } = action.payload
                const existingPost = state.posts.find(post => post.id === id)
                if (existingPost){
                    if (!existingPost.liked.includes(user)){
                        existingPost.liked.push(user);
                    }else{
                        existingPost.liked.splice(existingPost.liked.indexOf(user));
                    }
                }
            },
            prepare(id, user){
                return {
                    payload: {
                        id: id,
                        user                        
                    }
                }
            }
        },

        postUpdated: {
            reducer(state, action){
                const { id, title, content, user, date } = action.payload
                const existingPost = state.posts.find(post => post.id === id)
                if (existingPost){
                    existingPost.title = title
                    existingPost.content = content
                    existingPost.user = user
                    existingPost.date = date
                }
            },
            prepare(id, title, content, user, date){
                return {
                    payload: {
                        id: id,
                        title, content, user,
                        date
                    }
                }
            }
        }
    }    
});

export const { postAdded, postLiked, postUpdated } = postSlice.actions;
export default postSlice.reducer;

export const selectAllPost = state => state.post.posts;
export const selectPostById = (state, postId) => state.post.posts.find(post => post.id === postId);