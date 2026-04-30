import React from 'react';
import type { IconProps } from '../types';

export function BatteryPlusIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="5" width="4" height="2" fill={color}/>
      <rect x="14" y="5" width="4" height="2" fill={color}/>
      <rect x="4" y="17" width="4" height="2" fill={color}/>
      <rect x="14" y="17" width="4" height="2" fill={color}/>
      <rect x="2" y="7" width="2" height="10" fill={color}/>
      <rect x="18" y="5" width="2" height="14" fill={color}/>
      <rect x="20" y="9" width="2" height="6" fill={color}/>
      <rect x="15" y="13" width="8" height="2" transform="rotate(180 15 13)" fill={color}/>
      <rect x="12" y="16" width="2" height="8" transform="rotate(180 12 16)" fill={color}/>
    </svg>
  );
}
