import TextField from "@mui/material/TextField/TextField"
import React, { ChangeEvent, KeyboardEvent, memo, useState } from "react"
import { IconButton } from "@mui/material"
import { AddBox } from "@mui/icons-material"

type AddItemFormPropsType = {
  addItem: (title: string, helpers: AddItemFormSubmitHelperType) => void
  disabled?: boolean
}
export type AddItemFormSubmitHelperType = {
  setError: (error: string) => void
  setTitle: (title: string) => void
}
export const AddItemForm = memo(function ({ disabled = false, ...props }: AddItemFormPropsType) {
  let [title, setTitle] = useState("")
  let [error, setError] = useState<string | null>(null)

  const addItem = async () => {
    if (title.trim() !== "") {
      props.addItem(title, { setTitle, setError })
    } else {
      setError("Title is required")
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
        style={{ marginLeft: "5px" }}>
        <AddBox />
      </IconButton>
    </div>
  )
})