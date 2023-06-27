import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { OneAIAnalyticsApiWrapper } from '../src/wrappers/OneAIAnalyticsApiWrapper';

const meta: Meta = {
  title: 'Analytics',
  component: OneAIAnalyticsApiWrapper,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

export const Template: StoryObj = {
  render: (args) => (
    <div className="h-screen w-full">
      <OneAIAnalyticsApiWrapper {...args} />
    </div>
  ),
};
