import { ComponentPropsWithoutRef, ElementType } from 'react'

import { FilterValuesType } from '@/redux/todolists-reducer'
import Button from '@mui/material/Button'

type ButtonProps<T extends ElementType = 'button'> = {
  as?: T
  buttonFilter: FilterValuesType
  callBack: (value: FilterValuesType) => void
  color: 'error' | 'info' | 'inherit' | 'primary' | 'secondary' | 'success' | 'warning'
  filter: FilterValuesType
  text: string
} & Pick<ComponentPropsWithoutRef<T>, 'color'>
export const FilterButton = <T extends ElementType = 'button'>(
  props: ButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>
) => {
  const { buttonFilter, callBack, color, filter, text, ...rest } = props

  return (
    <Button
      {...rest}
      color={color}
      onClick={() => callBack(buttonFilter)}
      variant={filter === buttonFilter ? 'outlined' : 'text'}
    >
      {text}
    </Button>
  )
}
