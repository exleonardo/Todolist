import { ChangeEvent, useState } from 'react'
import { EditableSpanPropsType } from '@/widgets/editable-span'

export const useEditSpan = (props: EditableSpanPropsType) => {
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState(props.value)

  const activateEditMode = () => {
    setEditMode(true)
    setTitle(props.value)
  }
  const activateViewMode = () => {
    setEditMode(false)
    props.onChange(title)
  }
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }
  return {
    changeTitle,
    activateViewMode,
    activateEditMode,
    editMode,
    title,
  }
}
