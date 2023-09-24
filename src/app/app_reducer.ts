import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError,} from "../utils/error-utils";
import {currentAuthData, isLoginIn} from "./auth_reducer";
import {authAPI} from "../api/todolist-api";
import {AxiosError} from "axios";
import { ResponseCode } from "../enums/ResponseCode";
import {StatusRequest} from "../enums/statusRequest";

const initialState = {
    error: null as string | null,
    status: StatusRequest.idle as StatusRequest,
    isInitialization: false as boolean,
};

export const appInitializationAsync = createAsyncThunk(
    "app/initialization",
    async (_, {rejectWithValue, dispatch}) => {
        try {
            const response = await authAPI.getAuthData();
            if (response.data.resultCode === ResponseCode.Ok) {
                dispatch(isLoginIn({isLoggedIn: true}));
                dispatch(currentAuthData(response.data.data));
            } else {
                handleServerAppError(response.data, dispatch);
            }
            return {isAuthorized: true};
        } catch (err) {
            let error = err as AxiosError;
            handleServerNetworkError(error, dispatch);
            return {isAuthorized: true};
            // return rejectWithValue(error);
        }
    }
);

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error;
        },
        setAppStatusRequest: (
            state,
            action: PayloadAction<{ status: StatusRequest }>
        ) => {
            state.status = action.payload.status;
        },
        setAppInitialization: (
            state,
            action: PayloadAction<{ isAuthorized: boolean }>
        ) => {
            state.isInitialization = action.payload.isAuthorized;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(appInitializationAsync.pending, (state, action) => { 
                // не дописано, просто проба
            })
            .addCase(appInitializationAsync.fulfilled, (state, action) => {
                state.isInitialization = action.payload.isAuthorized
            })
            .addCase(appInitializationAsync.rejected, (state, action) => {
                if (action.error.message)
                    state.error = action.error.message 
                    // не дописано, просто проба
            })
    },
});

export const appReducer = slice.reducer;
export const {setAppError, setAppStatusRequest} = slice.actions;
