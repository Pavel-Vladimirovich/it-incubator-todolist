import React from "react";
import style from './Todolist.module.scss';

import { FilterValuesType } from "../../App";

export type TaskType = {
  id: number
  title: string
  isDone: boolean
}

type PropsType = {
  title: string
  tasks: Array<TaskType>
  removeTask: (id: number) => void;
  changeFilter: (value: FilterValuesType) => void;
}

function Todolist(props: PropsType) {
  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input />
        <button className={style.btn}>+</button>
      </div>
      <ul>
        {
          props.tasks.map(item =>
            <li><input type="checkbox" checked={item.isDone} /> <span>{item.title}</span><button className={`${style.btn} ${style.btn_remove}`} onClick={() => { props.removeTask(item.id) }}>close task</button>
            </li>)
        }
        {/* <li><input type="checkbox" checked={props.tasks[0].isDone} /> <span>{props.tasks[0].title}</span></li>
				<li><input type="checkbox" checked={props.tasks[1].isDone} /> <span>{props.tasks[1].title}</span></li>
				<li><input type="checkbox" checked={props.tasks[2].isDone} /> <span>{props.tasks[2].title}</span></li> */}

      </ul>
      <div className={style.block__buttons}>
        <button className={style.btn} onClick={() => { props.changeFilter("all") }}>All</button>
        <button className={style.btn} onClick={() => { props.changeFilter("active") }}>Active</button>
        <button className={style.btn} onClick={() => { props.changeFilter("completed") }}>Completed</button>
      </div>
    </div>
  );
}

export default Todolist;