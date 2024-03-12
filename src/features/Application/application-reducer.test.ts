import { AppInitialState } from '@/features/Application/application-reducer'
import { appReducer } from '@/features/Application/index'
import { appActions } from '@/features/common-actions/application-common-action'
import { beforeEach, expect, test } from 'vitest'
let startState: AppInitialState
const { setAppError, setAppStatus } = appActions
beforeEach(() => {
  startState = {
    error: null,
    status: 'idle',
    isInitialized: false,
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
