import type { Meta, StoryObj } from '@storybook/react'

import { ReduxStoreProviderDecorator } from '@/app/decorators/redux-store-decorator'
import { AddItemForm } from '@/widgets/addItem-form/ui/add-Item-form'

const meta: Meta<typeof AddItemForm> = {
  argTypes: {
    addItem: { action: 'clicked', description: 'Button clicked inside form' },
  },
  component: AddItemForm,
  decorators: [ReduxStoreProviderDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'AddItemForm',
}

export default meta
type Story = StoryObj<typeof AddItemForm>
export const AddItemFormStory: Story = {}
export const AddItemFormDisabledStory: Story = {
  args: {
    disabled: true,
  },
}
