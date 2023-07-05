import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValuesType} from "./App";
import {v1} from "uuid";


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
  }//Фильтр Tasks
  const removeTask = (id: string) => {
    let filteredTasks = props.tasks.filter((t) => t.id !== id);
    props.setTasks(filteredTasks)
  }// Удаление таски

  let tasksForTodolist = props.tasks;//Данные State
  if (filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.isDone)
  } /*Условия сортировки */
  if (filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => !t.isDone)
  }

  const removeAllTask = () => {
    props.setTasks([])
  } // Удаляет все таски
  const sortTask = () => {
    let sortTask = props.tasks.slice(0, 3);
    props.setTasks(sortTask)
  }//Выбирает первые три таски из props.tasks
  const addTask = (title: string) => {
    let newTask = {id: v1(), title: title, isDone: false}// Добавили навую таску с уникальным идентификатором
    let updateNewTask = [newTask, ...props.tasks] // делаем копию Tasks чтобы не изменять tasks
    // по правилам и добавляем новый массив, сформировав другой
    props.setTasks(updateNewTask)
  }// Добавление таски

  const [newTaskTitle, setNewTaskTitle] = useState("")// Создаем стейт для работы с Input
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value)
  } // Событие изменения в Input
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTask(newTaskTitle);
      setNewTaskTitle("");
    }

  }//Событие нажатия кнопки в Input и добавление таски по нажатию ENT
  const addTaskTodo = () => {
    addTask(newTaskTitle);
    setNewTaskTitle("");
  }
  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input value={newTaskTitle} onChange={onChangeHandler} onKeyPress={onKeyPressHandler}/>
        <button onClick={addTaskTodo}>+</button>
      </div>
      <ul>
        {tasksForTodolist.map((t, index) =>
          <li key={index}>
            <input type="checkbox" checked={t.isDone}/>
            <span>{t.title}</span>
            <button onClick={(e) => removeTask(t.id)}>x</button>
          </li>)
        }
      </ul>
      <button onClick={(e) => removeAllTask()}>Delete Task</button>
      <div>
        <button onClick={(e) => changeFilter("all")}>All</button>
        <button onClick={(e) => changeFilter("active")}>Active</button>
        <button onClick={(e) => changeFilter("completed")}>Completed</button>
        <button onClick={(e) => sortTask()}>FIRST 1-3 TASK</button>
      </div>
    </div>
  )
}