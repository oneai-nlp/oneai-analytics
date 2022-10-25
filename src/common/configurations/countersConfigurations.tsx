import { CountersConfigurations } from '../types/customizeBarTypes';
import {
  FaceFrownIcon,
  FaceSmileIcon,
  UserIcon,
} from '@heroicons/react/20/solid';
import React from 'react';

export const defaultCountersConfigurations: CountersConfigurations = {
  signals: {
    items: [
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
  person: {
    display: {
      color: 'white',
      icon: <UserIcon />,
    },
  },
  emotion: {
    items: [
      {
        label: 'positive',
        display: {
          color: 'green',
          icon: <FaceSmileIcon />,
        },
        members: [{ values: ['happiness'] }],
      },
      {
        label: 'negative',
        display: {
          color: 'red',
          icon: <FaceFrownIcon />,
        },
        members: [{ values: ['anger', 'sadness'] }],
      },
      {
        label: 'happiness',
        display: {
          color: 'green',
          icon: <FaceSmileIcon />,
        },
      },
      {
        label: 'surprise',
        display: {
          color: 'green',
          icon: <FaceSmileIcon />,
        },
      },
      {
        label: 'happiness',
        display: {
          color: 'green',
          icon: <FaceSmileIcon />,
        },
      },
      {
        label: 'anger',
        display: {
          color: 'red',
          icon: <FaceFrownIcon />,
        },
      },
      {
        label: 'sadness',
        display: {
          color: 'red',
          icon: <FaceFrownIcon />,
        },
      },
    ],
  },
};
