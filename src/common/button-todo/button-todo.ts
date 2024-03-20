import { FilterValuesType } from '@/redux/todolists-reducer'

type ButtonTodo = {
  buttonFilter: FilterValuesType
  color: 'error' | 'inherit' | 'primary' | 'secondary'
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
