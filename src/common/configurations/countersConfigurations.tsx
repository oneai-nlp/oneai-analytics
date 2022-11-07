import { CountersConfigurations } from '../types/customizeBarTypes';
import {
  FaceFrownIcon,
  FaceSmileIcon,
  UserIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  GlobeAltIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  UsersIcon,
  ScaleIcon,
  CalendarIcon,
  HeartIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import { FilmIcon, HashtagIcon } from '@heroicons/react/20/solid';

export const defaultCountersConfigurations: CountersConfigurations = {
  signals: {
    display: {
      color: 'white',
      icon: (
        <span className="flex flex-col" style={{ height: '1em' }}>
          <HandThumbUpIcon />
          <HandThumbDownIcon />
        </span>
      ),
    },
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
  topic: {
    display: {
      color: 'white',
      icon: <HashtagIcon />,
    },
  },
  keyword: {
    display: {
      color: 'white',
      icon: <KeyIcon />,
    },
  },
  geo: {
    display: {
      color: 'white',
      icon: <GlobeAltIcon />,
    },
  },
  org: {
    display: {
      color: 'white',
      icon: <BuildingOffice2Icon />,
    },
  },
  location: {
    display: {
      color: 'white',
      icon: <MapPinIcon />,
    },
  },
  groups: {
    display: {
      color: 'white',
      icon: <UsersIcon />,
    },
  },
  art: {
    display: {
      color: 'white',
      icon: <FilmIcon />,
    },
  },
  law: {
    display: {
      color: 'white',
      icon: <ScaleIcon />,
    },
  },
  event: {
    display: {
      color: 'white',
      icon: <CalendarIcon />,
    },
  },
  sentiment: {
    display: {
      color: 'white',
      icon: (
        <span className="flex flex-col" style={{ height: '1em' }}>
          <HandThumbUpIcon />
          <HandThumbDownIcon />
        </span>
      ),
    },
    items: [
      {
        label: 'POS',
        display: {
          color: 'green',
          icon: <HandThumbUpIcon />,
        },
      },
      {
        label: 'NEG',
        display: {
          color: 'red',
          icon: <HandThumbDownIcon />,
        },
      },
    ],
  },
  emotion: {
    display: {
      color: 'white',
      icon: <HeartIcon />,
    },
    items: [
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
      {
        label: 'surprise',
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
