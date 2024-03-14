import { FilterValuesType } from '@/redux/todolists-reducer'
import { ComponentPropsWithoutRef, ElementType } from 'react'
import Button from '@mui/material/Button'

type ButtonProps<T extends ElementType = 'button'> = {
  as?: T
  color: 'inherit' | 'secondary' | 'primary' | 'success' | 'error' | 'info' | 'warning'
  buttonFilter: FilterValuesType
  text: string
  callBack: (value: FilterValuesType) => void
  filter: FilterValuesType
} & Pick<ComponentPropsWithoutRef<T>, 'color'>
export const FilterButton = <T extends ElementType = 'button'>(
  props: ButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>
) => {
  const { buttonFilter, filter, callBack, text, color, ...rest } = props

  return (
    <Button
      {...rest}
      variant={filter === buttonFilter ? 'outlined' : 'text'}
      onClick={() => callBack(buttonFilter)}
      color={color}
    >
      {text}
    </Button>
  )
}
