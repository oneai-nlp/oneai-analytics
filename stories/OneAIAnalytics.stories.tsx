import { Meta, Story } from '@storybook/react';
import React from 'react';
import { OneAiAnalytics } from '../src/components/OneAiAnalytics';
import { clusters } from './data/clusters';

const meta: Meta = {
  title: 'One AI Analytics',
  component: OneAiAnalytics,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = args => (
  <div className="h-screen w-full">
    <OneAiAnalytics clusters={[]} {...args} />
  </div>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Treemap = Template.bind({});

Treemap.args = { clusters: clusters.slice(0, 30) };
