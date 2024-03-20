import { memo } from 'react'

import { useAddItemForm } from '@/widgets/addItem-form/hooks/useAddItemForm'
import clsx from 'clsx'

import s from '../style/add-item-form.module.scss'

export type AddItemFormPropsType = {
  addItem: (title: string) => Promise<any>
  buttonStyle?: string
  buttonTitle?: string
  className?: string
  disabled?: boolean
  inputStyle?: string
  inputTitle?: string
}
export const AddItemForm = memo(function ({
  buttonStyle,
  buttonTitle = '+',
  className,
  disabled = false,
  inputStyle,
  inputTitle = 'Enter title',
  ...props
}: AddItemFormPropsType) {
  const { addItem, error, onChangeHandler, onKeyPressHandler, title } = useAddItemForm(props)
  const classes = clsx(className && className, error && s.errorBlock)
  const inputClasses = clsx(error ? s.inputError : inputStyle + ' ' + s.input)
  const buttonClasses = clsx(s.button, buttonStyle)

  return (
    <div className={classes}>
      <div style={{ display: 'flex' }}>
        <input
          className={inputClasses}
          disabled={disabled}
          onChange={onChangeHandler}
          onKeyPress={onKeyPressHandler}
          placeholder={inputTitle}
          type={'text'}
          value={title}
        />
        <button className={buttonClasses} disabled={disabled} onClick={addItem}>
          <span className={s.lable}>{buttonTitle}</span>
        </button>
      </div>
      <div style={{ color: 'red' }}>{error}</div>
    </div>
  )
})
