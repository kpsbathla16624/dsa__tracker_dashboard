import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: ""
};

export const userIdslice = createSlice({
    name: 'useridslice',
    initialState,
    reducers: {
        setid: (state, action) => {
           
            state.id = action.payload;
        },
        
    }
});

export const { setid } = userIdslice.actions;
export default userIdslice.reducer;
