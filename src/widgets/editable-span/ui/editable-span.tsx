import React from 'react'
import { TextField } from '@mui/material'
import { useEditSpan } from '@/widgets/editable-span/hooks/useEditSpan'

export type EditableSpanPropsType = {
  value: string
  onChange: (newValue: string) => void
}

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {
  const { editMode, activateEditMode, activateViewMode, changeTitle, title } = useEditSpan(props)

  return (
    <>
      {editMode && (
        <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode} />
      )}
      {!editMode && <span onDoubleClick={activateEditMode}>{props.value}</span>}
    </>
  )
})
