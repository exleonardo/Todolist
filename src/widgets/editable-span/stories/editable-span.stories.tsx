import { EditableSpan } from '@/widgets/editable-span/ui/editable-span'
import { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof EditableSpan> = {
  component: EditableSpan,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'editable span',
}

export default meta
type Story = StoryObj<typeof EditableSpan>

export const EditableSpanBase: Story = {
  render: () => {
    return <EditableSpan onChange={() => {}} value={'title'} />
  },
}
