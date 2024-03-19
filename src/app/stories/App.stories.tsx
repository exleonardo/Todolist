import type { Meta, StoryObj } from '@storybook/react'

import { ReduxStoreProviderDecorator } from '@/app/decorators/redux-store-decorator'
import { App } from '@/app/ui/App'

const meta: Meta<typeof App> = {
  args: {
    demo: true,
  },
  component: App,
  decorators: [ReduxStoreProviderDecorator],
  title: 'App',
}

export default meta
export type Story = StoryObj<typeof App>

export const AppWithReduxStory: Story = {}
