import { TaskPrioties, TaskStatuses } from '@/api/todolists-api'
import { ReduxStoreProviderDecorator } from '@/app/decorators/redux-store-decorator'
import { Task } from '@/features/Task/ui/Task'

export default {
  component: Task,
  decorators: [ReduxStoreProviderDecorator],
  parameters: {
    layout: 'centered',
  },
  title: 'Task Component',
}

export const TaskBaseExample = () => {
  return (
    <>
      <Task
        task={{
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
          todoListId: 'todolistID1',
        }}
        todolistId={'todolistID1'}
      />
      <Task
        task={{
          addedDate: '',
          completed: false,
          deadline: '',
          description: '',
          id: '2',
          order: 0,
          priority: TaskPrioties.Low,
          startDate: '',
          status: TaskStatuses.New,
          title: 'JS',
          todoListId: 'todolistID2',
        }}
        todolistId={'todolistID2'}
      />
    </>
  )
}
