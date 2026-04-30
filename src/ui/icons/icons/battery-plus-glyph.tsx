import React from 'react';
import type { IconProps } from '../types';

export function BatteryPlusGlyphIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path d="M20 9H22V15H20V19H2V5H20V9ZM10 8V11H7V13H10V16H12V13H15V11H12V8H10Z" fill={color}/>
    </svg>
  );
}
