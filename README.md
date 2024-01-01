<p align="left">
  <a href="https://oneai.com?utm_source=open_source&utm_medium=oneai_analytics_treemap">
    <img src="./oneai_logo_light.svg" height="60">
  </a>
</p>

# One AI Analytics Treemap

One AI is a NLP as a service platform. Our API enables language comprehension in context, transforming texts from any source into structured data to use in code.

This treemap component is an easy API to display the results of our clustering skill.

## Documentation

See the [documentation](https://studio.oneai.com/docs?utm_source=open_source&utm_medium=oneai_analytics_treemap)

## Getting started

### Installation

`npm install oneai-analytics`

or using yarn

`yarn add oneai-analytics`

### Example

See the [online example](https://codesandbox.io/s/oneai-analytics-treemap-g3qrzn)

```typescript
import { AnalyticsTreemap } from 'oneai-analytics-treemap';

const MyAnalyticsComponent = () => {
  return (
    <div style={{ display: 'grid', minHeight: '80vh' }}>
      <AnalyticsTreemap clusters={clusters} />
    </div>
  );
};

// clusters are the result of our clustering skill API
const clusters = [
  {
    skill: 'CLUSTER-TOPICS',
    text: 'Buy the dip',
    items_count: 12,
    span_text: 'Buy the dip',
    phrases: [
      {
        text: 'Buy the dip',
        items_count: 9,
        phrases: {
          'Buy the dip': 6,
          'I bought the dip': 2,
          'Buy the dips and hold': 1,
        },
      },
      {
        text: 'Buying The Dip 💎✋',
        items_count: 3,
        phrases: {
          'Buying The Dip 💎✋': 1,
          'Bought the Dip 🚀🦍': 1,
          'BUYING THE DIP! 🚀🚀🚀': 1,
        },
      },
    ],
  },
  {
    skill: 'CLUSTER-TOPICS',
    text: 'Sndl🚀🚀🚀',
    items_count: 4,
    span_text: 'Sndl🚀🚀🚀',
    phrases: [
      {
        text: 'Sndl🚀🚀🚀',
        items_count: 2,
        phrases: {
          'Sndl🚀🚀🚀': 1,
          '💎': 1,
        },
      },
      {
        text: '💎🙌🙌🙌💎. 🦍🚀',
        items_count: 2,
        phrases: {
          '💎🙌🙌🙌💎. 🦍🚀': 1,
          '🦍. 💎🙌': 1,
        },
      },
    ],
  },
];
```

## Support

Feel free to submit issues in this repo, contact us at [devrel@oneai.com](mailto:devrel@oneai.com), or chat with us on [Discord](https://discord.gg/ArpMha9n8H)

## Contribute

PRs are welcomed!

First, clone the repo and install dependencies.

Develop:

```bash
yarn start
```

Test:

```bash
yarn test
```

Publish:

```bash
yarn publish
```

Run the exmaple:

```bash
cd example
yarn install
yarn start
```
