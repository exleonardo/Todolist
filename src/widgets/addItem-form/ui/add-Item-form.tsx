import TextField from '@mui/material/TextField/TextField'
import { memo } from 'react'
import { IconButton } from '@mui/material'
import { AddBox } from '@mui/icons-material'
import { useAddItemForm } from '@/widgets/addItem-form/hooks/useAddItemForm'

export type AddItemFormPropsType = {
  addItem: (title: string) => Promise<any>
  disabled?: boolean
}
export const AddItemForm = memo(function ({ disabled = false, ...props }: AddItemFormPropsType) {
  const { onChangeHandler, onKeyPressHandler, title, error, addItem } = useAddItemForm(props)

  return (
    <div>
      <TextField
        variant="outlined"
        error={!!error}
        value={title}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        label="Title"
        helperText={error}
        disabled={disabled}
      />
      <IconButton
        color="primary"
        onClick={addItem}
        disabled={disabled}
        style={{ marginLeft: '5px' }}
      >
        <AddBox />
      </IconButton>
    </div>
  )
})
