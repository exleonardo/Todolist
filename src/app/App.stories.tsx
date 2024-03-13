import type { Meta, StoryObj } from '@storybook/react'

import { App } from '@/App'
import { ReduxStoreProviderDecorator } from '@/redux-store-decorator'

const meta: Meta<typeof App> = {
  title: 'App',
  component: App,
  args: {
    demo: true,
  },
  decorators: [ReduxStoreProviderDecorator],
}

export default meta
export type Story = StoryObj<typeof App>

export const AppWithReduxStory: Story = {}
