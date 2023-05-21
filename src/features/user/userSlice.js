import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAuthenticated: localStorage.getItem('token') !== null,
        isPharmacist: localStorage.getItem('user_role') === 'P',
        isAdmin: localStorage.getItem('user_role') === 'A',
    },
    reducers: {
        userLogin: state => {
            state.isAuthenticated = localStorage.getItem('token') !== null;
            state.isPharmacist = localStorage.getItem('user_role') === 'P';
            state.isAdmin = localStorage.getItem('user_role') === 'A';
        },
        userLogout: state => {
            state.isAuthenticated = false;
            state.isPharmacist = false;
            state.isAdmin = false;
        },
    },
});

export const {
    userLogin,
    userLogout,
} = userSlice.actions;

export const userReducer = userSlice.reducer;