import React from 'react';
import type { IconProps } from '../types';

export function Heading3Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="6" width="2" height="12" fill={color}/>
      <rect x="3" y="11" width="10" height="2" fill={color}/>
      <rect x="11" y="6" width="2" height="12" fill={color}/>
      <rect x="15" y="16" width="4" height="2" fill={color}/>
      <rect x="19" y="14" width="2" height="2" fill={color}/>
      <rect x="15" y="12" width="4" height="2" fill={color}/>
      <rect x="19" y="10" width="2" height="2" fill={color}/>
      <rect x="17" y="8" width="2" height="2" fill={color}/>
      <rect x="15" y="8" width="2" height="2" fill={color}/>
    </svg>
  );
}
