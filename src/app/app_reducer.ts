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
        } catch (err) {
            let error = err as AxiosError;
            handleServerNetworkError(error, dispatch);
            return rejectWithValue({error});
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(appInitializationAsync.pending, (state, action) => {
                state.isInitialization = false
            })
            .addCase(appInitializationAsync.fulfilled, (state, action) => {
                state.isInitialization = true
            })
            .addCase(appInitializationAsync.rejected, (state, action) => {
                state.isInitialization = true
            })
    },
});

export const appReducer = slice.reducer;
export const {setAppError, setAppStatusRequest} = slice.actions;
