import React from 'react';

export function ColorsAxis({
  width,
  colorsConfig,
}: {
  width: number;
  colorsConfig: string[];
}) {
  return (
    <div
      style={{
        width: width,
        opacity: 0.9,
      }}
      className="h-full fixed flex flex-col"
    >
      {colorsConfig.map((colorConfig, i) => (
        <div
          key={i}
          className="w-full"
          style={{
            background: colorConfig,
            height: '4px',
            marginTop: i === 0 ? 'auto' : '1px',
          }}
        ></div>
      ))}
    </div>
  );
}
