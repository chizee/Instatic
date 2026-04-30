import React from 'react';
import type { IconProps } from '../types';

export function HandMetalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="21" y="7" width="2" height="5" fill={color}/>
      <rect x="17" y="7" width="2" height="5" fill={color}/>
      <rect x="13" y="8" width="2" height="4" fill={color}/>
      <rect x="9" y="5" width="2" height="7" fill={color}/>
      <rect x="5" y="5" width="2" height="8" fill={color}/>
      <rect x="19" y="5" width="2" height="2" fill={color}/>
      <rect x="15" y="8" width="2" height="2" fill={color}/>
      <rect x="11" y="8" width="2" height="2" fill={color}/>
      <rect x="7" y="3" width="2" height="2" fill={color}/>
      <rect x="3" y="11" width="2" height="2" fill={color}/>
      <rect x="1" y="13" width="2" height="2" fill={color}/>
      <rect x="1" y="15" width="2" height="2" fill={color}/>
      <rect x="3" y="17" width="2" height="2" fill={color}/>
      <rect x="5" y="19" width="2" height="2" fill={color}/>
      <rect x="7" y="21" width="12" height="2" fill={color}/>
      <rect x="19" y="19" width="2" height="2" fill={color}/>
      <rect x="21" y="12" width="2" height="7" fill={color}/>
      <rect x="5" y="13" width="2" height="2" fill={color}/>
      <rect x="7" y="15" width="2" height="2" fill={color}/>
    </svg>
  );
}
