/**
 * @description Filter values:
 * @description all = 'all'
 * @description completed = 'completed'
 * @description active = 'active'
 * */

export enum FilterValues {
    all = "all",
    completed = "completed",
    active = "active",
}
/**
 * @description Server response codes.
 * @description Ok = 0 - good response
 *
 */

export enum  ResponseCode {
    Ok = 0
}

/**
 * @description server request status
 */

export enum StatusRequest {
    idle = "idle",
    loading = "loading",
    succeeded = "succeeded",
    failed = " failed",
}

/**
 * @description Task status:
 * @description New = 0
 * @description InProgress = 1
 * @description Completed = 2
 * @description Draft = 3
 */

export enum TaskStatus {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}