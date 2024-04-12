import { TaskPrioties, TaskStatuses } from '@/api/todolists-api'
import { TasksStateType } from '@/app/ui/App'
import { tasksReducer, todolistsActions } from '@/features/todolists-list'
import { addTask, fetchTask, removeTask, updateTask } from '@/redux/tasks-reducer'
import { v1 } from 'uuid'
import { beforeEach, expect, test } from 'vitest'

let startState: TasksStateType = {}

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        addedDate: '',
        completed: false,
        deadline: '',
        description: '',
        id: '1',
        order: 0,
        priority: TaskPrioties.Low,
        startDate: '',
        status: TaskStatuses.Completed,
        title: 'CSS',
        todoListId: 'todolistId1',
      },
      {
        addedDate: '',
        completed: false,
        deadline: '',
        description: '',
        id: '2',
        order: 0,
        priority: TaskPrioties.Low,
        startDate: '',
        status: TaskStatuses.Completed,
        title: 'JS',
        todoListId: 'todolistId1',
      },
      {
        addedDate: '',
        completed: false,
        deadline: '',
        description: '',
        id: '3',
        order: 0,
        priority: TaskPrioties.Low,
        startDate: '',
        status: TaskStatuses.Completed,
        title: 'React',
        todoListId: 'todolistId1',
      },
    ],
    todolistId2: [
      {
        addedDate: '',
        completed: false,
        deadline: '',
        description: '',
        id: '1',
        order: 0,
        priority: TaskPrioties.Low,
        startDate: '',
        status: TaskStatuses.Completed,
        title: 'bread',
        todoListId: 'todolistId2',
      },
      {
        addedDate: '',
        completed: false,
        deadline: '',
        description: '',
        id: '2',
        order: 0,
        priority: TaskPrioties.Low,
        startDate: '',
        status: TaskStatuses.Completed,
        title: 'milk',
        todoListId: 'todolistId2',
      },
      {
        addedDate: '',
        completed: false,
        deadline: '',
        description: '',
        id: '3',
        order: 0,
        priority: TaskPrioties.Low,
        startDate: '',
        status: TaskStatuses.Completed,
        title: 'tea',
        todoListId: 'todolistId2',
      },
    ],
  }
})

test('correct task should be deleted from correct array', () => {
  const param = { taskId: '2', todolistId: 'todolistId2' }
  const action = removeTask.fulfilled(param, '', param)

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(2)
  expect(endState['todolistId2'].every(t => t.id !== '2')).true
})
test('correct task should be added to correct array', () => {
  const task = {
    task: {
      addedDate: '',
      completed: false,
      deadline: '',
      description: '',
      id: '1',
      order: 0,
      priority: TaskPrioties.Low,
      startDate: '',
      status: TaskStatuses.New,
      title: 'juce',
      todoListId: 'todolistId2',
    },
  }
  const action = addTask.fulfilled(task, '', {
    title: task.task.title,
    todolistId: task.task.todoListId,
  })

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(4)
  expect(endState['todolistId2'][0].id).toBeDefined()
  expect(endState['todolistId2'][0].title).toBe('juce')
  expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})
test('status of specified task should be changed', () => {
  const updateModel = {
    domainModel: {
      status: TaskStatuses.New,
    },
    taskId: '2',
    todolistId: 'todolistId2',
  }
  const action = updateTask.fulfilled(updateModel, '', updateModel)

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
  expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
})
test('title of specified task should be changed', () => {
  const taskTitle = {
    domainModel: { title: 'yogurt' },
    taskId: '2',
    todolistId: 'todolistId2',
  }
  const action = updateTask.fulfilled(taskTitle, '', taskTitle)

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'][1].title).toBe('JS')
  expect(endState['todolistId2'][1].title).toBe('yogurt')
  expect(endState['todolistId2'][0].title).toBe('bread')
})
test('new array should be added when new todolist is added', () => {
  const todolist = {
    todolist: {
      addedDate: '',
      id: v1(),
      order: 0,
      title: 'newTitle',
    },
  }
  const action = todolistsActions.addTodolist.fulfilled(todolist, '', todolist.todolist.title)

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2')

  if (!newKey) {
    throw Error('new key should be added')
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})
test('propertry with todolistId should be deleted', () => {
  const todo = { id: 'todolistId2' }
  const action = todolistsActions.removeTodolist.fulfilled(todo, '', todo.id)

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState['todolistId2']).not.toBeDefined()
})
test('empty array should be added when we set todolist', () => {
  const todolist = {
    todolists: [
      { addedDate: '', id: '1', order: 0, title: 'What to learn' },
      { addedDate: '', id: '2', order: 0, title: 'What to buy' },
    ],
  }
  const action = todolistsActions.fetchTodolist.fulfilled(todolist, '')

  const endState = tasksReducer({}, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(2)
  expect(endState['1']).toStrictEqual([])
  expect(endState['2']).toStrictEqual([])
})

test('tasks shuold be added for todolist', () => {
  const action = fetchTask.fulfilled(
    {
      tasks: startState['todolistId1'],
      todolistId: 'todolistId1',
    },
    '',
    'todolistId1'
  )

  const endState = tasksReducer(
    {
      todolistId1: [],
      todolistId2: [],
    },
    action
  )

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(0)
})
