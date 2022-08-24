import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Example } from '../src/components/Example';

const meta: Meta = {
  title: 'Welcome',
  component: Example,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = args => <Example text={''} {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = { text: 'hi' };
