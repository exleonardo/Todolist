import React from "react"
import { action } from "@storybook/addon-actions"
import { EditableSpan } from "common/components/EditableSpan/EditableSpan"

export default {
  title: "Editable span",
  component: EditableSpan,
  parameters: {
    layout: "centered",
  },
}
const callBack = action("Editable Span changed")
export const EditableSpanBase = () => {
  return <EditableSpan value={"Editable span"} onChange={callBack} />
}
