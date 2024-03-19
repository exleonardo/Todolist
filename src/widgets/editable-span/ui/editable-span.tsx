import React from 'react'

import { useEditSpan } from '@/widgets/editable-span/hooks/useEditSpan'
import clsx from 'clsx'

import s from '../style/editable-span.module.scss'

export type EditableSpanPropsType = {
  className?: string
  onChange: (newValue: string) => void
  value: string
}

export const EditableSpan = React.memo(function ({ className, ...props }: EditableSpanPropsType) {
  const { activateEditMode, activateViewMode, changeTitle, editMode, title } = useEditSpan(props)
  const classes = clsx(s.title, className)

  return (
    <>
      {editMode && (
        <input
          autoFocus
          className={s.input}
          onBlur={activateViewMode}
          onChange={changeTitle}
          value={title}
        />
      )}

      {!editMode && (
        <h4 className={classes} onDoubleClick={activateEditMode} title={'double click to edit'}>
          {props.value}
        </h4>
      )}
    </>
  )
})
