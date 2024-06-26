import { ChangeEvent, KeyboardEvent, useState } from 'react'

import { appActions } from '@/common/common-actions/application-common-action'
import { useActions } from '@/utils/redux-utils'
import { AddItemFormPropsType } from '@/widgets/addItem-form'

export const useAddItemForm = (props: AddItemFormPropsType) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<null | string>(null)
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

  return {
    addItem,
    error,
    onChangeHandler,
    onKeyPressHandler,
    title,
  }
}
