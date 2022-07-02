import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { useNavigate } from 'react-router-dom';


let hostname = window.location.hostname;
let hostPath = "http://" + hostname + "/renmedata";

export function getUrl(target){
    //return hostPath + target;
    return "https://renmedata.herokuapp.com" + target;
}

export const withRouter = (Component) => {
    const Wrapper = (props) => {
        const navigate = useNavigate();
        return (
            <Component navigate = {navigate}{...props}/>
        );
    };
    return Wrapper;
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: hostPath}),
    tagTypes: ['Post', 'User', 'Reaction', 'Ip', 'Chats'],
    endpoints: builder => ({
        refetch: builder.mutation({
            query: (post) => ({
                url: '/refetch.php',
                method: 'POST',
                body: post
            }),
            invalidatesTags: ['Reaction']
        }),
        getPost: builder.query({
            query: id => `/get_post.php?id=${id}`,
            providesTags: ['Post']
        }),
        getPosts: builder.query({
            query: (user) => `/get_posts.php?id=${user}`,
            providesTags: ['Post']
        }),
        getComments: builder.query({
            query: (id) => `/get_comments.php?id=${id}`,
            providesTags: ['Reaction']
        }),
        addComment: builder.mutation({
            query: (post) => ({
                url: '/add_comment.php',
                method: 'POST',
                body: post
            }),
            invalidatesTags: ['Reaction']
        }),
        updatePost: builder.mutation({
            query: (post) => ({
                url: '/update_post.php',
                method: 'POST',
                body: post
            }),
            invalidatesTags: ['Post']
        }),
        deletePost: builder.mutation({
            query: (id) => ({
                url: '/delete_post.php',
                method: 'POST',
                body: id
            }),
            invalidatesTags: ['Post']
        }),
        uploadImage: builder.mutation({
            query: (data) => ({
                url: '/upload_image.php',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Post']
        }),
        getIp: builder.query({
            query: () => '/get_ip.php',
            providesTags: ['Ip']
        }),
        getUser: builder.query({
            query: id => `/get_user.php?id=${id}`,
            providesTags: ['User']
        }),
        updateUser: builder.mutation({
            query: (post) => ({
                url: '/update_user.php',
                method: 'POST',
                body: post
            }),
            invalidatesTags: ['User']
        }),
        getLikes: builder.query({
            query: (id) => `/get_likes.php?id=${id}`,
            providesTags: ['Reaction']
        }),
        addLikes: builder.mutation({
            query: (post) => ({
                url: '/add_likes.php',
                method: 'POST',
                body: post
            }),
            invalidatesTags: ['Reaction']
        }),
        getSeen: builder.query({
            query: (id) => `/get_seen.php?id=${id}`,
            providesTags: ['Reaction']
        }),
        addSeen: builder.mutation({
            query: (post) => ({
                url: '/add_seen.php',
                method: 'POST',
                body: post
            }),
            invalidatesTags: ['Reaction']
        }),
        getChat: builder.query({
            query: (id) => `/get_chat.php?id=${id}`,
            providesTags: ['Chats']
        }),
        addChat: builder.mutation({
            query: (post) => ({
                url: '/add_chat.php',
                method: 'POST',
                body: post
            }),
            invalidatesTags: ['Chats']
        }),
        updateChat: builder.mutation({
            query: (post) => ({
                url: '/update_chat.php',
                method: 'POST',
                body: post
            }),
            invalidatesTags: ['Chats']
        }),
        resetChat: builder.mutation({
            query: (post) => ({
                url: '/refetch.php',
                method: 'POST',
                body: post
            }),
            invalidatesTags: ['Chats']
        })

    })
})

export const {
    useRefetchMutation, useResetChatMutation,
    useGetPostQuery, useGetPostsQuery, useAddCommentMutation, useGetCommentsQuery, useUpdatePostMutation,
    useDeletePostMutation, useUploadImageMutation, useGetIpQuery, useGetUserQuery, useUpdateUserMutation,
    useGetLikesQuery, useAddLikesMutation, useGetSeenQuery, useAddSeenMutation, useGetChatQuery, useAddChatMutation,
    useUpdateChatMutation
} = api;

