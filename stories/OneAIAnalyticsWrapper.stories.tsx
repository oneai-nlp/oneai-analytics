import { Meta, Story } from '@storybook/react';
import React from 'react';
import { OneAIAnalyticsItemsWrapper } from '../src/components/OneAIAnalyticsItemsWrapper';
import { items } from './data/items';

const meta: Meta = {
  title: 'One AI Analytics Wrapper',
  component: OneAIAnalyticsItemsWrapper,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = args => (
  <div className="h-screen w-full">
    <OneAIAnalyticsItemsWrapper items={[]} {...args} />
  </div>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Treemap = Template.bind({});

Treemap.args = { items: items };
