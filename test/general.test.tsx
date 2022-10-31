import { render } from '@testing-library/react';
import React from 'react';
import * as ResizeObserverModule from 'resize-observer-polyfill';
import '../src/common/utils/polyfill';
import { OneAiAnalytics } from '../src/components/OneAiAnalytics';
(global as any).ResizeObserver = ResizeObserverModule.default;

describe('Treemap', () => {
  it('renders without crashing', () => {
    const component = render(<OneAiAnalytics dataNodes={[]} />);
    component.unmount();
  });
});
