import {appReducer, setAppError, setAppStatusRequest, StatusRequest} from "./app_reducer";

const startState = {
    error: null,
    status: StatusRequest.idle
}

test("correct error should be set", ()=>{
    const endState = appReducer(startState, setAppError("some error"))
    expect(endState.error).toBe("some error")
})
test("correct status should be set", ()=>{
    const endState = appReducer(startState, setAppStatusRequest(StatusRequest.loading))
    expect(endState.status).toBe(StatusRequest.loading)
})