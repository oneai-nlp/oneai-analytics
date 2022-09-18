import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { OneAIAnalyticsStaticDataWrapper } from '../dist';
import { clusters } from '../stories/data/clusters';

const App = () => {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <OneAIAnalyticsStaticDataWrapper exampleNodes={clusters} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
