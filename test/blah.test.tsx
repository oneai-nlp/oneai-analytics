import React from 'react';
import { Treemap } from '../stories/Thing.stories';
import { render } from '@testing-library/react';
import '../src/common/polyfill';

describe('Treemap', () => {
  it('renders without crashing', () => {
    const component = render(<Treemap />);
    component.unmount();
  });
});
