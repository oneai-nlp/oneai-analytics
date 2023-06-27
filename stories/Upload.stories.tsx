import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { OneAiUpload } from '../src/components/OneAiUpload';

const meta: Meta = {
  title: 'Upload',
  component: OneAiUpload,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

export const Template: StoryObj = {
  render: (args) => (
    <div className="h-screen w-full">
      <OneAiUpload {...args} />
    </div>
  ),
};
