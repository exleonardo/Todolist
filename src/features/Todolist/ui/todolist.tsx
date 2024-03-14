import React from 'react'
import { AddItemForm } from '@/widgets/addItem-form/ui/add-Item-form'
import { EditableSpan } from '@/widgets/editable-span/ui/editable-span'

import { IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { TaskType } from '@/api/todolists-api'
import { TodolistDomainType } from '@/redux/todolists-reducer'
import Paper from '@mui/material/Paper'
import { Task } from '@/features/Task/ui/Task'
import { buttonTodo } from '@/common/button-todo/button-todo'
import { FilterButton } from '@/features/filter-button/ui/filter-button'
import { useTodolist } from '@/features/Todolist/hooks/useTodolist'
import s from '../style/content-todo.module.scss'

type PropsType = {
  todolist: TodolistDomainType
  tasks: TaskType[]
  demo?: boolean
}

export const Todolist = React.memo(function ({ ...props }: PropsType) {
  const {
    tasksForTodolist,
    removeTodolistCallback,
    changeTodolistTitleCallback,
    addTaskCallback,
    onFilterButtonClickHandler,
  } = useTodolist(props.todolist, props.tasks)
  return (
    <Paper className={s.contentTodo}>
      <IconButton
        size={'small'}
        className={s.deleteIcon}
        onClick={removeTodolistCallback}
        disabled={props.todolist.entityStatus === 'loading'}
      >
        <Delete fontSize={'small'} />
      </IconButton>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleCallback} />
      </h3>
      <AddItemForm addItem={addTaskCallback} />
      <div>
        {tasksForTodolist.map(t => (
          <Task task={t} todolistId={props.todolist.id} key={t.id} />
        ))}
        {!tasksForTodolist.length && (
          <div className={s.titleFirstTask}>Create your first task☝️</div>
        )}
      </div>
      <div className={s.blockButtonFilter}>
        {buttonTodo.map(button => {
          return (
            <FilterButton
              filter={props.todolist.filter}
              color={button.color}
              text={button.text}
              buttonFilter={button.buttonFilter}
              callBack={onFilterButtonClickHandler}
            />
          )
        })}
      </div>
    </Paper>
  )
})
