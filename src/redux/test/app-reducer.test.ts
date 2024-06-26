import { appReducer } from '@/app'
import { appActions } from '@/common/common-actions/application-common-action'
import { AppInitialState } from '@/redux/app-reducer'
import { beforeEach, expect, test } from 'vitest'

let startState: AppInitialState
const { setAppError, setAppStatus } = appActions

beforeEach(() => {
  startState = {
    error: null,
    isInitialized: false,
    status: 'idle',
  }
})
test('correct error message should be set', () => {
  const endState = appReducer(startState, setAppError({ error: 'some error' }))

  expect(endState.error).toBe('some error')
})
test('correct status should be set', () => {
  const endState = appReducer(startState, setAppStatus({ status: 'loading' }))

  expect(endState.status).toBe('loading')
})
