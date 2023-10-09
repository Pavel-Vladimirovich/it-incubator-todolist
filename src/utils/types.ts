
type FieldErrorType = {

}


export type ThunkErrorType = {
    rejectValue: {errors: string[], fieldsError?: FieldErrorType[]}
}