import { ComponentPropsWithoutRef, ElementType } from 'react'

import { FilterValuesType } from '@/redux/todolists-reducer'
import clsx from 'clsx'

import s from '../style/button-filter.module.scss'

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
  const classes = clsx(s.button, filter === buttonFilter ? s.buttonSelect : s.button)

  return (
    <button {...rest} className={classes} onClick={() => callBack(buttonFilter)}>
      {text}
    </button>
  )
}
