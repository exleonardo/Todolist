import React, { forwardRef } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { TaskType } from '@/api/todolists-api'
import { buttonTodo } from '@/common/button-todo/button-todo'
import { Task } from '@/features/Task/ui/Task'
import { useTodolist } from '@/features/Todolist/hooks/useTodolist'
import { FilterButton } from '@/features/filter-button/ui/filter-button'
import { TodolistDomainType } from '@/redux/todolists-reducer'
import { formatDate } from '@/utils/format-date'
import { formatToTime } from '@/utils/format-time'
import { getDayOfWeekFromString } from '@/utils/format-week'
import { AddItemForm } from '@/widgets/addItem-form/ui/add-Item-form'
import { EditableSpan } from '@/widgets/editable-span/ui/editable-span'
import { Delete } from '@mui/icons-material'

import s from '../style/content-todo.module.scss'

type PropsType = {
  demo?: boolean
  index: number
  tasks: TaskType[]
  todolist: TodolistDomainType
}

export const Todolist = React.memo(
  forwardRef<any, PropsType>(function ({ index, tasks, todolist, ...rest }: PropsType, ref) {
    const {
      addTaskCallback,
      changeTodolistTitleCallback,
      onDragEnd,
      onFilterButtonClickHandler,
      removeTodolistCallback,
      tasksForTodolist,
    } = useTodolist(todolist, tasks)

    return (
      <div ref={ref} {...rest}>
        <Draggable draggableId={todolist.id} index={index} key={index}>
          {provided => (
            <div className={s.contentTodo} ref={provided.innerRef} {...provided.draggableProps}>
              <button
                className={s.deleteIcon}
                disabled={todolist.entityStatus === 'loading'}
                onClick={removeTodolistCallback}
              >
                <Delete color={'error'} fontSize={'small'} />
              </button>

              <div className={s.title} {...provided.dragHandleProps}>
                <EditableSpan onChange={changeTodolistTitleCallback} value={todolist.title} />
              </div>
              <div className={s.addedDate}>
                <p>{getDayOfWeekFromString(todolist.addedDate)}:</p>
                <p>{formatDate(todolist.addedDate)}</p>
                <p>{formatToTime(todolist.addedDate)}</p>
              </div>

              <div className={s.contentBlock}>
                <div className={s.taskContent}>
                  <AddItemForm
                    addItem={addTaskCallback}
                    className={s.addTask}
                    inputTitle={'Enter title task'}
                  />
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable direction={'vertical'} droppableId={todolist.id}>
                      {provided => (
                        <div
                          className={s.taskblock}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {tasksForTodolist.map((t, index) => {
                            return (
                              <Task index={index} key={index} task={t} todolistId={todolist.id} />
                            )
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  {!tasksForTodolist.length && (
                    <div className={s.titleFirstTask}>Create your first task☝️</div>
                  )}
                </div>
              </div>
              <div className={s.blockButtonFilter}>
                {buttonTodo.map((button, index) => {
                  return (
                    <FilterButton
                      buttonFilter={button.buttonFilter}
                      callBack={onFilterButtonClickHandler}
                      color={button.color}
                      filter={todolist.filter}
                      key={index}
                      text={button.text}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </Draggable>
      </div>
    )
  })
)
