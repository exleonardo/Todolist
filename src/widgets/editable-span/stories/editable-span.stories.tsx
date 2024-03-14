import { EditableSpan } from '@/widgets/editable-span/ui/editable-span'
import { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof EditableSpan> = {
  title: 'editable span',
  component: EditableSpan,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EditableSpan>

export const EditableSpanBase: Story = {
  render: () => {
    return <EditableSpan value={'title'} onChange={() => {}} />
  },
}
