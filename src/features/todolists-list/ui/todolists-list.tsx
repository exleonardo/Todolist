import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import { Navigate } from 'react-router-dom'

import { Todolist } from '@/features/Todolist'
import { useTodolistList } from '@/features/todolists-list/hooks/useTodolistList'
import { AddItemForm } from '@/widgets/addItem-form/ui/add-Item-form'

import s from '../style/list-todolis.module.scss'

type TodolistsListPropsType = {
  demo?: boolean
}
export const TodolistsList = ({ demo = false }: TodolistsListPropsType) => {
  const { addTodolistCallback, changeOrderTodo, isLoggedIn, tasks, todolists } =
    useTodolistList(demo)

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  }
  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId, source } = result

    if (!destination) {
      return
    }
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }
    let putAfterItemId = null

    if (todolists[todolists.length - 1] === todolists[destination.index]) {
      putAfterItemId = todolists[destination.index].id
    } else if (todolists[destination.index - 1] && source.index !== 0) {
      putAfterItemId = todolists[destination.index - 1].id
    } else if (source.index === 0) {
      putAfterItemId = todolists[destination.index].id
    }
    changeOrderTodo({
      id: draggableId,
      putAfterItemId,
    })
  }
  const grid = 8
  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightGreen' : 'lightblue',
    display: 'flex',
    overflow: 'auto',
    padding: grid,
  })

  return (
    <>
      <AddItemForm addItem={addTodolistCallback} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable direction={'horizontal'} droppableId={'todos'}>
          {(provided, snapshot) => (
            <div
              className={s.contentTodo}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
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
    </>
  )
}
