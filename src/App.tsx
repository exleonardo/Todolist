import React, {useState} from "react";
import "./App.css";
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";


export type FilterValuesType = "all" | "completed" | "active"

function App() {

  let [tasks, setTasks] = useState<Array<TaskType>>([
    {id: v1(), title: "HTML&CSS", isDone: true},
    {id: v1(), title: "JS", isDone: true},
    {id: v1(), title: "ReactJS", isDone: false},
    {id: v1(), title: "Redux", isDone: false},
    {id: v1(), title: "Redux", isDone: false},
    {id: v1(), title: "Redux", isDone: false},

  ]);
  let [filter, setFilter] = useState<FilterValuesType>("all");


  let tasksForTodolist = tasks;//Данные State
  if (filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.isDone)
  } /*Условия сортировки */
  if (filter === "active") {
    tasksForTodolist = tasks.filter((t) => !t.isDone)
  }

  const addTask = (title: string) => {
    let newTask = {id: v1(), title: title, isDone: false}// Добавили навую таску с уникальным идентификатором
    let updateNewTask = [newTask, ...tasks] // делаем копию Tasks чтобы не изменять tasks
    // по правилам и добавляем новый массив, сформировав другой
    setTasks(updateNewTask)
  }// Добавление таски
  const changeStatus = (taskId: string, isDone: boolean) => {
    let task = tasks.find((t) => t.id === taskId)
    if (task) {
      task.isDone = !isDone // Переписываем значение
    }
    setTasks([...tasks]) // Обновляем значение в стейт так как task это ссылка и она изменила в элементе isDone
  }


  return (
    <div className="App">
      <Todolist changeTaskStatus={changeStatus} setFilter={setFilter} title="What to learn" tasks={tasksForTodolist}
                setTasks={setTasks}
                addTask={addTask}
                filter={filter}/>
    </div>
  );
}

export default App;
