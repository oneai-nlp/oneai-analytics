import React from 'react';
import { FC } from 'react';
import { ItemsDisplayComponentProps } from '../common/types/configurations';

export const ItemsListDisplay: FC<ItemsDisplayComponentProps> = ({
  items,
  bgColor,
  textColor,
}) => {
  return (
    <div style={{ backgroundColor: bgColor, color: textColor }}>
      {items.map(item => (
        <div className="p-2" key={item}>
          {item}
        </div>
      ))}
    </div>
  );
};
