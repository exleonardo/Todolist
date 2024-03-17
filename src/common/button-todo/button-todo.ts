import { FilterValuesType } from '@/redux/todolists-reducer'

type ButtonTodo = {
  buttonFilter: FilterValuesType
  color: 'error' | 'info' | 'inherit' | 'primary' | 'secondary' | 'success' | 'warning'
  text: string
}

export const buttonTodo: ButtonTodo[] = [
  { buttonFilter: 'all', color: 'inherit', text: 'All' },
  {
    buttonFilter: 'active',
    color: 'primary',
    text: 'Active',
  },
  { buttonFilter: 'completed', color: 'secondary', text: 'Completed' },
]
