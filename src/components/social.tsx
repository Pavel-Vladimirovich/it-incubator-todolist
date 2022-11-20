
import React from 'react';

type MesType = {
    message: string
}

const Message: React.FC<MesType> = (props) => {
    return(
        <div>
            <h1>{props.message}</h1>
        </div>
    )
}

type DialogsType ={
    id: number
    name: string
}
type PostType = {
    id: number
    message: string
}
type ProfileType = {
    post: Array<PostType>
}
type DialogPage = {
    dialogs: Array<DialogsType>
}
type SideType = {}
type RootStateType = {
    profilePage: ProfileType
    dialogPage: DialogPage
    sideBar: SideType
}

let state: RootStateType = {
    profilePage:{
        post:[
            {id:1, message: 'hello'},
            {id:2, message: 'hello'},
            {id:3, message: 'hello'},
            {id:4, message: 'hello'}
        ]
    },
    dialogPage:{
        dialogs:[
            {id:1, name: 'victor'},
            {id:2, name: 'victor2'},
            {id:3, name: 'victor3'},
            {id:4, name: 'victor4'},
        ]
    },
    sideBar:{}
}



export default state