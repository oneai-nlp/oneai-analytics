import React, { FC } from 'react';
import './index.css';

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */
export const Thing: FC<{ text: string }> = ({ text = 'asdf' }) => {
  return <div className="text-xl text-blue-500">{text}</div>;
};
