import { Meta, Story } from '@storybook/react';
import React from 'react';
import { OneAIAnalyticsApiWrapper } from '../src/wrappers/OneAIAnalyticsApiWrapper';

const meta: Meta = {
  title: 'One AI Analytics api wrapper',
  component: OneAIAnalyticsApiWrapper,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = (args) => (
  <div className="h-screen w-full">
    <OneAIAnalyticsApiWrapper {...args} />
  </div>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const OneAIAnalyticsApiWrapperStory = Template.bind({});
