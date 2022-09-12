import { Meta, Story } from '@storybook/react';
import React from 'react';
import { OneAIAnalyticsStaticDataWrapper } from '../src/wrappers/OneAIAnalyticsStaticDataWrapper';
import { clusters } from './data/clusters';

const meta: Meta = {
  title: 'One AI Analytics static example',
  component: OneAIAnalyticsStaticDataWrapper,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = args => (
  <div className="h-screen w-full">
    <OneAIAnalyticsStaticDataWrapper exampleNodes={[]} {...args} />
  </div>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const OneAIAnalyticsStaticExample = Template.bind({});

OneAIAnalyticsStaticExample.args = { exampleNodes: clusters };
