import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValuesType} from "./App";


type TodolistType = {
  title: string;
  tasks: TaskType[];
  setTasks: (value: TaskType[]) => void
  setFilter: (value: FilterValuesType) => void
  addTask: (value: string) => void
  changeTaskStatus: (taskId: string, isDone: boolean) => void
  filter: FilterValuesType
}
export type TaskType = {
  id: string;
  title: string;
  isDone: boolean
}


export const Todolist = (props: TodolistType) => {
  // styles for buttons
  const styleAll = props.filter === "all" ? "active-filter" : "";
  const styleActive = props.filter === "active" ? "active-filter" : "";
  const styleCompleted = props.filter === "completed" ? "active-filter" : "";
  //----------------------------------------------------------------------------------

  const [newTaskTitle, setNewTaskTitle] = useState("")// Создаем стейт для работы с Input
  const [error, setError] = useState<string | null>(null)// Стейт для установки ошибки инпута и сообщения об ошибке

  const changeFilter = (value: FilterValuesType) => {
    props.setFilter(value)
  }//Фильтр Tasks
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value)
  } // Событие изменения в Input
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError("")
    if (e.key === "Enter") {
      addTaskTodo()
      setNewTaskTitle("");
    }
  }//Событие нажатия кнопки в Input и добавление таски по нажатию ENT
  const addTaskTodo = () => {
    if (newTaskTitle.trim() !== "") {
      props.addTask(newTaskTitle.trim());
      setNewTaskTitle("");
    } else {
      setError("Введите имя")
    }

  }

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input className={error ? "error" : ""} value={newTaskTitle} onChange={onChangeHandler}
               onKeyPress={onKeyPressHandler}/>
        <button onClick={addTaskTodo}>+</button>
        {error && <div className="error-message">{error}</div>}
      </div>
      <ul>
        {props.tasks.map((t, index) => {

            const removeTask = (id: string) => {
              let filteredTasks = props.tasks.filter((t) => t.id !== id);
              props.setTasks(filteredTasks)
            }// Удаление таски
            const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
              props.changeTaskStatus(t.id, t.isDone) // Добавляем id и значение установки чекбокса
            }//Установка чекбокса
            return <li key={index} className={t.isDone ? "is-done" : ""}>
              <input type="checkbox" checked={t.isDone} onChange={onChangeHandler}/>
              <span>{t.title}</span>
              <button onClick={(e) => removeTask(t.id)}>x</button>
            </li>
          }
        )
        }
      </ul>
      <div>
        <button className={styleAll} onClick={(e) => changeFilter("all")}>All
        </button>
        <button className={styleActive} onClick={(e) => changeFilter("active")}>Active
        </button>
        <button className={styleCompleted} onClick={(e) => changeFilter("completed")}>Completed
        </button>
      </div>
    </div>
  )
}