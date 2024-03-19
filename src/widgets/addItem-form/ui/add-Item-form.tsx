import { memo } from 'react'

import { useAddItemForm } from '@/widgets/addItem-form/hooks/useAddItemForm'
import clsx from 'clsx'

import s from '../style/add-item-form.module.scss'

export type AddItemFormPropsType = {
  addItem: (title: string) => Promise<any>
  buttonTitle?: string
  className?: string
  disabled?: boolean
  inputTitle?: string
}
export const AddItemForm = memo(function ({
  buttonTitle = '+',
  className,
  disabled = false,
  inputTitle = 'Enter title',
  ...props
}: AddItemFormPropsType) {
  const { addItem, error, onChangeHandler, onKeyPressHandler, title } = useAddItemForm(props)
  const classes = clsx(className)
  const inputClasses = clsx(error ? s.inputError : s.input)

  return (
    <div className={classes}>
      <input
        className={inputClasses}
        disabled={disabled}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        placeholder={inputTitle}
        type={'text'}
        value={title}
      />
      <div style={{ color: 'red' }}>{error}</div>
      <button className={s.button} disabled={disabled} onClick={addItem}>
        {buttonTitle}
      </button>
    </div>
  )
})
