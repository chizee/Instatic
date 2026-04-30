import React from 'react';
import type { IconProps } from '../types';

export function BottleWine2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="9" y="1" width="6" height="2" fill={color}/>
      <rect x="9" y="3" width="2" height="4" fill={color}/>
      <rect x="13" y="3" width="2" height="4" fill={color}/>
      <rect x="7" y="7" width="2" height="2" fill={color}/>
      <rect x="15" y="7" width="2" height="2" fill={color}/>
      <rect x="17" y="9" width="2" height="12" fill={color}/>
      <rect x="5" y="9" width="2" height="12" fill={color}/>
      <rect x="7" y="21" width="10" height="2" fill={color}/>
      <rect x="13" y="12" width="4" height="2" fill={color}/>
      <rect x="11" y="12" width="2" height="6" fill={color}/>
      <rect x="13" y="16" width="4" height="2" fill={color}/>
    </svg>
  );
}
