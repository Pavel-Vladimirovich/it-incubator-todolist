import React from "react";

type TaskType = {
  id: number
  title: string
  isDone: boolean
}
type PropsType = {
  title: string
  tasks: Array<TaskType>
}
function Todolist(props: PropsType) {
  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input />
        <button>+</button>
      </div>
      <ul>
        {
          props.tasks.map(item =>
            <li><input type="checkbox" checked={item.isDone} /> <span>{item.title}</span><button onClick={()=>{alert(item.id)}}>close task</button>
            </li>)
        }
        {/* <li><input type="checkbox" checked={props.tasks[0].isDone} /> <span>{props.tasks[0].title}</span></li>
				<li><input type="checkbox" checked={props.tasks[1].isDone} /> <span>{props.tasks[1].title}</span></li>
				<li><input type="checkbox" checked={props.tasks[2].isDone} /> <span>{props.tasks[2].title}</span></li> */}

      </ul>
      <div className='block__buttons-input'>
        <button className='btn btn__input'>All</button>
        <button className='btn btn__input'>Active</button>
        <button className='btn btn__input'>Completed</button>
      </div>
    </div>
  );
}

export default Todolist;