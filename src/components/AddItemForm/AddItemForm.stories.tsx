import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { AddItemForm } from "./AddItemForm"
import { action } from "@storybook/addon-actions"

const meta: Meta<typeof AddItemForm> = {
  title: "Todolist/AddItemForm",
  component: AddItemForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  //argTypes пропсы которые заданы не явно задаем необязательные параметры
  argTypes: {
    addItem: { action: "clicked", description: "Button clicked inside form" },
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
