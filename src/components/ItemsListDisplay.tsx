import React from 'react';
import { FC } from 'react';
import { ItemsDisplayComponentProps } from '../common/types/commonTypes';

export const ItemsListDisplay: FC<ItemsDisplayComponentProps> = ({
  items,
  bgColor,
  textColor,
}) => {
  return (
    <div style={{ backgroundColor: bgColor, color: textColor }}>
      {items.map((item, i) => (
        <div className="p-2" key={i}>
          {item}
        </div>
      ))}
    </div>
  );
};
