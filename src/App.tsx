import React, {useState} from "react";
import "./App.css";
import {TaskType, Todolist} from "./Todolist";

export type FilterValuesType = "all" | "completed" | "active"

function App() {

  let [tasks, setTasks] = useState<Array<TaskType>>([
    {id: 1, title: "HTML&CSS", isDone: true},
    {id: 2, title: "JS", isDone: true},
    {id: 3, title: "ReactJS", isDone: false}
  ]);
  let [filter, setFilter] = useState<FilterValuesType>("all");

  const removeTask = (id: number) => {

    let filteredTasks = tasks.filter((t) => t.id !== id);
    setTasks(filteredTasks)
  }
  // const tasks2 = [
  //   {id: 1, title: "Hello world", isDone: true},
  //   {id: 2, title: "I am Happy", isDone: false},
  //   {id: 3, title: "Yo", isDone: false}
  // ]

  const changeFilter = (value: FilterValuesType) => {
    setFilter(value)
  }
  let tasksForTodolist = tasks;
  if (filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.isDone)
  }
  if (filter === "active") {
    tasksForTodolist = tasks.filter((t) => !t.isDone)
  }

  return (
    <div className="App">
      <Todolist changeFilter={changeFilter} title="What to learn" tasks={tasksForTodolist} removeTask={removeTask}/>
      {/*<Todolist title="Songs" tasks={tasks2}/>*/}
    </div>
  );
}


export default App;
