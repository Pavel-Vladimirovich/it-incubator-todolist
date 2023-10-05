import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { authAPI, AuthDataType, LoginDataType } from "../../api/todolist-api";
import {
    handleServerAppError,
    handleServerNetworkError
} from "../../utils/error-utils";
import { setAppStatusRequest } from "../../app/app_reducer";
import {enums} from "../../enums";


const initialState: InitialStateType = {
    id: null,
    login: "",
    email: "",
    isLoggedIn: false,
};

const loginAsync = createAsyncThunk(
    "auth/login",
    async (data: LoginDataType, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusRequest({status: enums.StatusRequest.loading}));
        try {
            const response = await authAPI.login(data);
            if (response.data.resultCode === enums.ResponseCode.Ok) {
                dispatch(setAppStatusRequest({status: enums.StatusRequest.succeeded}));
                return;
            } else {
                handleServerAppError(response.data, dispatch);
                dispatch(setAppStatusRequest({status: enums.StatusRequest.failed}));
                return rejectWithValue({});
            }
        } catch (err) {
            let error = err as AxiosError; // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch);
            return rejectWithValue(error);
        }
    }
);

const logoutAsync = createAsyncThunk(
  'auth/logout', 
  async (_, {dispatch, rejectWithValue}) => {
      dispatch(setAppStatusRequest({status: enums.StatusRequest.loading}));
    try{
      const response = await authAPI.logout()
      if (response.data.resultCode === enums.ResponseCode.Ok) {
        dispatch(setAppStatusRequest({status: enums.StatusRequest.succeeded}));
        return;
    } else {
        handleServerAppError(response.data, dispatch);
        dispatch(setAppStatusRequest({status: enums.StatusRequest.failed}));
        return rejectWithValue({});
    }
}catch(err) {
    let error = err as AxiosError; // необходимо типизировать т.к. ругается на тип unknown
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(error); // для обработки ошибок в auth_reducer / но может и не понадобится 
}});

export const authAsyncActions = {
    loginAsync,
    logoutAsync
}

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        currentAuthData: (state, action: PayloadAction<AuthDataType>) => {
            state.id = action.payload.id;
            state.login = action.payload.login;
            state.email = action.payload.email;
        },
        isLoginIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginAsync.fulfilled, (state, action) => {
           state.isLoggedIn = true;
        })
        .addCase(logoutAsync.fulfilled, (state, action) => {
            state.isLoggedIn = false;
        })
    },
});

export const authReducer = slice.reducer;
export const {currentAuthData, isLoginIn} = slice.actions;

// types
type InitialStateType = AuthDataType & { isLoggedIn: boolean };

