import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [
    {id: '1', content: {name: 'anonymous', comment: 'commented'}},
    {id: '2', content: {name: 'anonymous', comment: 'another commented'}}
]

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {}
})

export default commentSlice.reducer
