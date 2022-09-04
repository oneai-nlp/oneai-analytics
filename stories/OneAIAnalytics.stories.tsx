import { Meta, Story } from '@storybook/react';
import React from 'react';
import { OneAIAnalyticsApiWrapper } from '../src/components/OneAIAnalyticsApiWrapper';
import { clusters } from './data/clusters';

const meta: Meta = {
  title: 'One AI Analytics',
  component: OneAIAnalyticsApiWrapper,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = args => (
  <div className="h-screen w-full">
    <OneAIAnalyticsApiWrapper exampleNodes={[]} {...args} />
  </div>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const OneAIAnalytics = Template.bind({});

OneAIAnalytics.args = { exampleNodes: clusters };
