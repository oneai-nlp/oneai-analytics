import React from 'react';
import { FC } from 'react';
import { ItemsDisplayComponentProps } from '../types/configurations';

export const ItemsListDisplay: FC<ItemsDisplayComponentProps> = ({ items }) => {
  return (
    <div>
      {items
        .sort((i1, i2) => i2.count - i1.count)
        .map(item => (
          <div key={item.text}>
            {item.text} - {item.count}
          </div>
        ))}
    </div>
  );
};
