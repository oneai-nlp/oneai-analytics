import React from 'react';
import { render } from '@testing-library/react';
import '../src/common/utils/polyfill';
import { OneAIAnalyticsApiWrapper } from '../src/wrappers/OneAIAnalyticsApiWrapper';
import * as ResizeObserverModule from 'resize-observer-polyfill';
(global as any).ResizeObserver = ResizeObserverModule.default;

describe('Treemap', () => {
  it('renders without crashing', () => {
    const component = render(<OneAIAnalyticsApiWrapper />);
    component.unmount();
  });
});
