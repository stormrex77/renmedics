import { createSlice, nanoid } from "@reduxjs/toolkit";

/*const initialState = [
    {id: '1', name: 'Admin', active: true},
    {id: '2', name: 'user1', active: false}
]*/

const initialState = {
    users: [],
    status: 'idle',
    error: null
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {}
})

export default userSlice.reducer;
export const selectAllUser = state => state.user.users;
export const selectUserById = (state, userId) => state.user.users.find(user => user.id === userId);
