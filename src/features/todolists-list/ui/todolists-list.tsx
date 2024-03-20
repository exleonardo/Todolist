import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Navigate } from 'react-router-dom'

import { Todolist } from '@/features/Todolist'
import { useTodolistList } from '@/features/todolists-list/hooks/useTodolistList'
import { AddItemForm } from '@/widgets/addItem-form/ui/add-Item-form'

import s from '../style/list-todolis.module.scss'

type TodolistsListPropsType = {
  demo?: boolean
}
export const TodolistsList = ({ demo = false }: TodolistsListPropsType) => {
  const { addTodolistCallback, isLoggedIn, onDragEnd, tasks, todolists } = useTodolistList(demo)

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  }

  return (
    <div className={s.todoPage}>
      <AddItemForm
        addItem={addTodolistCallback}
        buttonStyle={s.buttonStlyle}
        buttonTitle={'+'}
        className={s.addTodo}
        inputStyle={s.inputStyle}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable direction={'horizontal'} droppableId={'todos'} type={'todos'}>
          {provided => (
            <div className={s.test} {...provided.droppableProps} ref={provided.innerRef}>
              {todolists.map((tl, index) => {
                return (
                  <Todolist
                    demo={demo}
                    index={index}
                    key={tl.id}
                    tasks={tasks[tl.id]}
                    todolist={tl}
                  />
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
