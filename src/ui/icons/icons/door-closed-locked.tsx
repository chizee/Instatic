import React from 'react';
import type { IconProps } from '../types';

export function DoorClosedLockedIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="19" width="8" height="2" fill={color}/>
      <rect x="5" y="5" width="2" height="14" fill={color}/>
      <rect x="7" y="3" width="10" height="2" fill={color}/>
      <rect x="17" y="5" width="2" height="5" fill={color}/>
      <rect x="9" y="11" width="2" height="2" fill={color}/>
      <rect x="13" y="16" width="10" height="2" fill={color}/>
      <rect x="13" y="21" width="10" height="2" fill={color}/>
      <rect x="13" y="18" width="2" height="3" fill={color}/>
      <rect x="21" y="18" width="2" height="3" fill={color}/>
      <rect x="19" y="14" width="2" height="2" fill={color}/>
      <rect x="17" y="12" width="2" height="2" fill={color}/>
      <rect x="15" y="14" width="2" height="2" fill={color}/>
    </svg>
  );
}
