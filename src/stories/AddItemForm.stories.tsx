import React from "react";
import {AddItemForm} from "../AddItemForm";
import {action} from '@storybook/addon-actions'

export default {
    title: "AddItemForm" ,
    component: AddItemForm ,
    parameters: {
        layout: 'centered' ,
    }
}
const callback = action ( "button add was pressed inside the form" )
export const AddItemFormBaseExample = () => {
    return <AddItemForm addItem={callback}/>
}