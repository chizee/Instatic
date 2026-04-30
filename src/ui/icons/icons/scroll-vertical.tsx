import React from 'react';
import type { IconProps } from '../types';

export function ScrollVerticalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="21" y="8" width="2" height="4" transform="rotate(-180 21 8)" fill={color}/>
      <rect x="5" y="8" width="2" height="4" transform="rotate(-180 5 8)" fill={color}/>
      <rect x="21" y="14" width="2" height="4" transform="rotate(-180 21 14)" fill={color}/>
      <rect x="5" y="14" width="2" height="4" transform="rotate(-180 5 14)" fill={color}/>
      <rect x="21" y="20" width="2" height="4" transform="rotate(-180 21 20)" fill={color}/>
      <rect x="5" y="20" width="2" height="4" transform="rotate(-180 5 20)" fill={color}/>
      <rect width="6" height="2" transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 15 18)" fill={color}/>
      <rect width="2" height="20" transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 13 2)" fill={color}/>
      <rect width="10" height="2" transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 17 16)" fill={color}/>
      <rect x="15" y="6" width="6" height="2" transform="rotate(-180 15 6)" fill={color}/>
      <rect x="17" y="8" width="10" height="2" transform="rotate(-180 17 8)" fill={color}/>
    </svg>
  );
}
