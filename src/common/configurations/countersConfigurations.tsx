import { CountersConfigurations } from '../types/customizeBarTypes';
import { FaceFrownIcon, FaceSmileIcon } from '@heroicons/react/20/solid';
import React from 'react';

export const defaultCountersConfigurations: CountersConfigurations = {
  signals: {
    groups: [
      {
        label: 'positive',
        display: {
          color: 'green',
          icon: <FaceSmileIcon />,
        },
        members: [
          { metadataName: 'emotion', values: ['happiness'] },
          { metadataName: 'sentiment', values: ['POS'] },
        ],
        isGroup: true,
      },
      {
        label: 'negative',
        display: {
          color: 'red',
          icon: <FaceFrownIcon />,
        },
        members: [
          { metadataName: 'emotion', values: ['anger', 'sadness'] },
          { metadataName: 'sentiment', values: ['NEG'] },
        ],
        isGroup: true,
      },
    ],
  },
  emotion: {
    groups: [
      {
        label: 'positive',
        display: {
          color: 'green',
          icon: <FaceSmileIcon />,
        },
        members: [{ values: ['happiness'] }],
        isGroup: true,
      },
      {
        label: 'negative',
        display: {
          color: 'red',
          icon: <FaceFrownIcon />,
        },
        members: [{ values: ['anger', 'sadness'] }],
        isGroup: true,
      },
      {
        label: 'happiness',
        display: {
          color: 'green',
          icon: <FaceSmileIcon />,
        },
      },
    ],
  },
};
