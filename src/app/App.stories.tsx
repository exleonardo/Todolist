import type {Meta , StoryObj} from '@storybook/react';

import {ReduxStoreProviderDecorator} from "../ReduxStoreDecorator";
import App from "./App";


// More on how to set up stories at:
// https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof App> = {
    title: 'App/Stories' ,
    component: App ,
    args: {
        demo: true
    } ,
    decorators: [ReduxStoreProviderDecorator]
};

export default meta;
type Story = StoryObj<typeof App>;

// More on component templates:
// https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const AppWithReduxStory: Story = {}