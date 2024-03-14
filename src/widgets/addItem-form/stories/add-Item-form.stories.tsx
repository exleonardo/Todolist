import type { Meta, StoryObj } from '@storybook/react'
import { AddItemForm } from '@/widgets/addItem-form/ui/add-Item-form'
import { ReduxStoreProviderDecorator } from '@/app/decorators/redux-store-decorator'

const meta: Meta<typeof AddItemForm> = {
  title: 'AddItemForm',
  component: AddItemForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [ReduxStoreProviderDecorator],
  argTypes: {
    addItem: { action: 'clicked', description: 'Button clicked inside form' },
  },
}

export default meta
type Story = StoryObj<typeof AddItemForm>
export const AddItemFormStory: Story = {}
export const AddItemFormDisabledStory: Story = {
  args: {
    disabled: true,
  },
}
