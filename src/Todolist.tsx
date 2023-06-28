import React, {useState} from "react";
import {FilterValuesType} from "./App";

type TodolistType = {
  title: string;
  tasks: TaskType[];
  setTasks: (value: TaskType[]) => void
}
export type TaskType = {
  id: string;
  title: string;
  isDone: boolean
}
export const Todolist = (props: TodolistType) => {

  let [filter, setFilter] = useState<FilterValuesType>("all");


  const changeFilter = (value: FilterValuesType) => {
    setFilter(value)
  }
  const removeTask = (id: string) => {
    let filteredTasks = props.tasks.filter((t) => t.id !== id);
    props.setTasks(filteredTasks)
  }
  let tasksForTodolist = props.tasks;
  if (filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.isDone)
  }
  if (filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => !t.isDone)
  }
  const removeAllTask = () => {
    props.setTasks([])
  }
  const sortTask = () => {

    let sortTask = props.tasks.slice(0, 3);

    props.setTasks(sortTask)
  }


  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input/>
        <button>+</button>
      </div>
      <ul>
        {tasksForTodolist.map((t, index) => <li key={index}><input type="checkbox" checked={t.isDone}/>
          <span>{t.title}</span>
          <button onClick={() => {
            removeTask(t.id)
          }}>x
          </button>
        </li>)}
      </ul>
      <button onClick={() => removeAllTask()}>Delete Task</button>
      <div>
        <button onClick={() => changeFilter("all")}>All</button>
        <button onClick={() => changeFilter("active")}>Active</button>
        <button onClick={() => changeFilter("completed")}>Completed</button>
        <button onClick={() => sortTask()}>FIRST 1-3 TASK</button>
      </div>
    </div>
  )
}