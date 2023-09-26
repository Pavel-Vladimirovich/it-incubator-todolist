import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { authAPI, AuthDataType, LoginDataType } from "../api/todolist-api";
import {
    handleServerAppError,
    handleServerNetworkError
} from "../utils/error-utils";
import { setAppStatusRequest } from "./app_reducer";
import {StatusRequest} from "../enums/statusRequest";
import { ResponseCode } from "../enums/responseCode";


const initialState: InitialStateType = {
    id: null,
    login: "",
    email: "",
    isLoggedIn: false,
};

export const loginAsync = createAsyncThunk(
    "auth/login",
    async (data: LoginDataType, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusRequest({status: StatusRequest.loading}));
        try {
            const response = await authAPI.login(data);
            if (response.data.resultCode === ResponseCode.Ok) {
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}));
                return;
            } else {
                handleServerAppError(response.data, dispatch);
                dispatch(setAppStatusRequest({status: StatusRequest.failed}));
                return rejectWithValue({});
            }
        } catch (err) {
            let error = err as AxiosError; // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch);
            return rejectWithValue(error);
        }
    }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout', 
  async (_, {dispatch, rejectWithValue}) => {
      dispatch(setAppStatusRequest({status: StatusRequest.loading}));
    try{
      const response = await authAPI.logout()
      if (response.data.resultCode === ResponseCode.Ok) {
        dispatch(setAppStatusRequest({status: StatusRequest.succeeded}));
        return;
    } else {
        handleServerAppError(response.data, dispatch);
        dispatch(setAppStatusRequest({status: StatusRequest.failed}));
        return rejectWithValue({});
    }
}catch(err) {
    let error = err as AxiosError; // необходимо типизировать т.к. ругается на тип unknown
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(error); // для обработки ошибок в auth_reducer / но может и не понадобится 
}});

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

