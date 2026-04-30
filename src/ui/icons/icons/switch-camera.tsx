import React from 'react';
import type { IconProps } from '../types';

export function SwitchCameraIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="1" y="6" width="2" height="12" fill={color}/>
      <rect x="3" y="18" width="7" height="2" fill={color}/>
      <rect x="21" y="6" width="7" height="2" transform="rotate(180 21 6)" fill={color}/>
      <rect x="12" y="18" width="9" height="2" fill={color}/>
      <rect x="12" y="6" width="9" height="2" transform="rotate(180 12 6)" fill={color}/>
      <rect x="21" y="6" width="2" height="12" fill={color}/>
      <rect x="14" y="16" width="2" height="6" fill={color}/>
      <rect x="10" y="8" width="2" height="6" transform="rotate(180 10 8)" fill={color}/>
      <rect x="16" y="14" width="2" height="10" fill={color}/>
      <rect x="8" y="10" width="2" height="10" transform="rotate(180 8 10)" fill={color}/>
      <rect x="10" y="8" width="4" height="2" fill={color}/>
      <rect x="8" y="10" width="2" height="4" fill={color}/>
      <rect x="14" y="10" width="2" height="4" fill={color}/>
      <rect x="10" y="14" width="4" height="2" fill={color}/>
    </svg>
  );
}
