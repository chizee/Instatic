import React from 'react';
import type { IconProps } from '../types';

export function CalendarLeftIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="5" y="4" width="14" height="2" fill={color}/>
      <rect x="5" y="20" width="6" height="2" fill={color}/>
      <rect x="3" y="10" width="2" height="10" fill={color}/>
      <rect x="3" y="6" width="2" height="2" fill={color}/>
      <rect x="19" y="6" width="2" height="2" fill={color}/>
      <rect x="19" y="10" width="2" height="2" fill={color}/>
      <rect x="3" y="8" width="18" height="2" fill={color}/>
      <rect x="15" y="2" width="2" height="2" fill={color}/>
      <rect x="7" y="2" width="2" height="2" fill={color}/>
      <rect width="8" height="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 17 22)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 15 20)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 15 16)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 17 14)" fill={color}/>
      <rect width="2" height="10" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 21 18)" fill={color}/>
    </svg>
  );
}
