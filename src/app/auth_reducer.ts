import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authAPI, AuthDataType, LoginDataType} from "../api/todolist-api";
import {
    handleServerAppError,
    handleServerNetworkError,
} from "../utils/error-utils";
import {setAppStatusRequest, StatusRequest} from "./app_reducer";
import {AppDispatch} from "./store";
import {AxiosError} from "axios";


const initialState: InitialStateType = {
    id: null,
    login: "",
    email: "",
    isLoggedIn: false,
};

export const loginAsync = createAsyncThunk(
    "auth/login",
    async (data: LoginDataType, {dispatch, rejectWithValue}) => {
        try {
            dispatch(setAppStatusRequest({status: StatusRequest.loading}));
            const response = await authAPI.login(data);
            if (response.data.resultCode === 0) {
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}));
                return {isLoggedIn: true};
            } else {
                handleServerAppError(response.data, dispatch);
                dispatch(setAppStatusRequest({status: StatusRequest.failed}));
                return {isLoggedIn: false};
            }
        } catch (err) {
            let error = err as AxiosError; // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch);
            return rejectWithValue(error);
        }
    }
);

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
        builder.addCase(loginAsync.fulfilled, (state, action) => {
           state.isLoggedIn = action.payload.isLoggedIn;
        });
    },
});

export const authReducer = slice.reducer;
export const {currentAuthData, isLoginIn} = slice.actions;

// export const authReducer = (state: InitialStateType = initialState, action: ActionType): InitialStateType => {
//     switch (action.type) {
//         case "AUTH/AUTH_DATA":
//             return {
//                 ...state,
//                 ...action.authData
//             }
//         case "AUTH/IS_LOGGED_IN":
//         return {
//             ...state,
//             isLoggedIn: action.isLoggedIn
//         }
//         default:
//             return state
//     }
// }

// actions

// export const currentAuthData = (authData: AuthDataType) => ({
//         type: "AUTH/AUTH_DATA",
//         authData
// } as const)

// export const login = (isLoggedIn: boolean) => ({
//     type: "AUTH/IS_LOGGED_IN",
//     isLoggedIn
// }as const)

// thunks

// export const _loginAsync = (data: LoginDataType) => (dispatch: AppDispatch) => {
//     dispatch(setAppStatusRequest({status: StatusRequest.loading}))
//     authAPI.login(data)
//         .then(response => {
//             if(response.data.resultCode === 0){
//                 dispatch(isLoginIn({isLoggedIn: true}))
//                 dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
//             }else{
//                 handleServerAppError(response.data, dispatch)
//                 dispatch(setAppStatusRequest({status: StatusRequest.failed}))
//             }
//         })
//         .catch(error => {
//             handleServerNetworkError(error, dispatch)
//         })
// }

export const logoutAsync = () => (dispatch: AppDispatch) => {
    dispatch(setAppStatusRequest({status: StatusRequest.loading}));
    authAPI
        .logout()
        .then((response) => {
            if (response.data.resultCode === 0) {
                dispatch(isLoginIn({isLoggedIn: false}));
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}));
            } else {
                handleServerAppError(response.data, dispatch);
                dispatch(setAppStatusRequest({status: StatusRequest.failed}));
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch);
        });
};

// types
type InitialStateType = AuthDataType & { isLoggedIn: boolean };

// type ActionType =
// | ReturnType<typeof login>
// | ReturnType<typeof currentAuthData>
