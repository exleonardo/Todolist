import React, { useEffect, useState } from 'react'
import { todolistsApi } from 'api/todolists-api'

export default {
  title: 'API',
}

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistsApi.getTodolists().then(res => setState(res.data))
  }, [])
  return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)
  const [title, setTitle] = useState('')
  const addTodo = () => {
    todolistsApi.createTodolist(title).then(res => setState(res.data))
  }
  return (
    <div>
      {JSON.stringify(state)}
      <input value={title} onChange={e => setTitle(e.currentTarget.value)} />
      <button onClick={addTodo}>add todolist</button>
    </div>
  )
}
export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistsApi
      .deleteTodolist('75cbbbae-39ee-4ba8-ab46-15d421cd18e2')
      .then(res => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistsApi
      .updateTodolistTitle('7dd32807-e50a-4247-93e7-64b2d534f959', 'LOL')
      .then(res => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistsApi.getTasks('7dd32807-e50a-4247-93e7-64b2d534f959').then(res => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const CreateTasks = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistsApi
      .createTask('7dd32807-e50a-4247-93e7-64b2d534f959', 'REACT!!')
      .then(res => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const DeleteTasks = () => {
  const [state, setState] = useState<any>(null)
  const [taskId, setTaskId] = useState('')
  const [todolistId, setTodolistId] = useState('')
  const deleteTask = () => {
    todolistsApi.deleteTask(todolistId, taskId).then(res => setState(res.data))
  }
  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          placeholder={'TodolistId'}
          onChange={e => setTodolistId(e.currentTarget.value)}
          value={todolistId}
        />
        <input
          placeholder={'TaskId'}
          value={taskId}
          onChange={e => setTaskId(e.currentTarget.value)}
        />
        <button onClick={deleteTask}>Delete Task</button>
      </div>
    </div>
  )
}
export const UpdateTask = () => {
  const [state, setState] = useState<any>(null)
  const [todolistId, setTodolistId] = useState('')
  const [taskId, setTaskId] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const updateTask = () => {
    todolistsApi
      .updateTask(todolistId, taskId, {
        title: newTitle,
        completed: false,
        deadline: null,
        startDate: null,
        description: 'Update task',
        priority: 1,
        status: 1,
      })
      .then(res => setState(res))
  }

  return (
    <div>
      {JSON.stringify(state)}
      <input
        placeholder={'todolistId'}
        value={todolistId}
        onChange={e => setTodolistId(e.currentTarget.value)}
      />
      <input
        placeholder={'taskId'}
        value={taskId}
        onChange={e => setTaskId(e.currentTarget.value)}
      />
      <input
        placeholder={'Enter new title'}
        value={newTitle}
        onChange={e => setNewTitle(e.currentTarget.value)}
      />
      <button onClick={updateTask}>Update task</button>
    </div>
  )
}
