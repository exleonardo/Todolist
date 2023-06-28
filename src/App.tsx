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

  return (
    <div className="App">
      <Todolist title="What to learn" tasks={tasks} setTasks={setTasks}/>
    </div>
  );
}

export default App;
