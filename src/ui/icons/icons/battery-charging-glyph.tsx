import React from 'react';
import type { IconProps } from '../types';

export function BatteryChargingGlyphIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M20 9H22V15H20V19H2V5H20V9ZM10 7V9H8V11H6V13H10V17H12V15H14V13H16V11H12V7H10Z" fill={color}/>
    </svg>
  );
}
