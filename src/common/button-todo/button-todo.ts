import { FilterValuesType } from '@/redux/todolists-reducer'

type ButtonTodo = {
  color: 'inherit' | 'secondary' | 'primary' | 'success' | 'error' | 'info' | 'warning'
  buttonFilter: FilterValuesType
  text: string
}

export const buttonTodo: ButtonTodo[] = [
  { color: 'inherit', buttonFilter: 'all', text: 'All' },
  {
    color: 'primary',
    buttonFilter: 'active',
    text: 'Active',
  },
  { color: 'secondary', buttonFilter: 'completed', text: 'Completed' },
]
