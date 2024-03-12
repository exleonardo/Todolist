import TextField from '@mui/material/TextField/TextField'
import { ChangeEvent, KeyboardEvent, memo, useState } from 'react'
import { IconButton } from '@mui/material'
import { AddBox } from '@mui/icons-material'
import { appActions } from '@/features/common-actions/application-common-action'
import { useActions } from '@/utils/redux-utils'

type AddItemFormPropsType = {
  addItem: (title: string) => Promise<any>
  disabled?: boolean
}
export const AddItemForm = memo(function ({ disabled = false, ...props }: AddItemFormPropsType) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { setAppError } = useActions(appActions)

  const addItem = async () => {
    if (title.trim() !== '') {
      props
        .addItem(title)
        .then(() => {
          setTitle('')
        })
        .catch(error => {
          error.messages ? setError(error.messages[0]) : setError(error.message)
          setAppError({ error: null })
        })
    } else {
      setError('Title is required')
    }
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null)
    }
    if (e.charCode === 13) {
      addItem()
    }
  }

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
