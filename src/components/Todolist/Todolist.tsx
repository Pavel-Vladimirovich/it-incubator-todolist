import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import style from './Todolist.module.scss';
import { FilterValuesType } from "../../App";

export type TaskType = {
  id: string,
  title: string,
  isDone: boolean,
}

type PropsType = {
  title: string,
  tasks: Array<TaskType>,
  addTask: (title: string) => void,
  removeTask: (id: string) => void,
  changeFilter: (value: FilterValuesType) => void,
  changeTaskStatus: (taskId: string, isDone: boolean) => void,
  filter: FilterValuesType
}



function Todolist(props: PropsType) {

  let [title, setTitle] = useState('');
  let [error, setError] = useState<string | null>(null)


  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  }
  const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (event.charCode === 13) {
      addTasksHandler()
      setTitle('');
    }
  }

  const addTasksHandler = () => {
    if (title.trim() === '') {
      setError('The field cannot be empty')
      return
    }
    if(title.length > 10){
      setError('Task name cannot be more than 10 letters')
      return
    }
    props.addTask(title.trim());
    setTitle('');
  }

  
  const onAllClickHandler = () => {
    props.changeFilter('all');
  }
  const onActiveClickHandler = () => {
    props.changeFilter('active');
  }
  const onCompletedClickHandler = () => {
    props.changeFilter('completed');
  }


  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input value={title} className={`${style.input_task} ${error ? style.error : ""}`} onChange={onChangeHandler} onKeyPress={onKeyPressHandler} />
        <button className={style.btn} onClick={addTasksHandler}>add task</button>
        {error && <div className={style.error_message}>{error}</div>}
      </div>
      <ul>
        {
          props.tasks.map(t => {
            const onClickHandler = () => props.removeTask(t.id);
            const onChangeHadler = (event: ChangeEvent<HTMLInputElement>) => {
              props.changeTaskStatus(t.id, event.currentTarget.checked)
            }
            return (
              <li>
                <input type="checkbox" checked={t.isDone} onChange={onChangeHadler} />
                <span>{t.title}</span>
                <button className={`${style.btn} ${style.btn_remove}`} onClick={onClickHandler}>close task</button>
              </li>)
          })
        }
      </ul>
      <div className={style.block__buttons}>
        <button className={`${style.btn} ${props.filter === 'all' ? style.active_filter : ""}`} onClick={onAllClickHandler}>All</button>
        <button className={`${style.btn} ${props.filter === 'active' ? style.active_filter : ""}`} onClick={onActiveClickHandler}>Active</button>
        <button className={`${style.btn} ${props.filter === 'completed' ? style.active_filter : ""}`} onClick={onCompletedClickHandler}>Completed</button>
      </div>
    </div>
  );
}

export default Todolist;