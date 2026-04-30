import React from 'react';
import type { IconProps } from '../types';

export function DuplicateIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="9" y="7" width="10" height="2" fill={color}/>
      <rect x="9" y="19" width="10" height="2" fill={color}/>
      <rect x="7" y="9" width="2" height="10" fill={color}/>
      <rect x="19" y="9" width="2" height="10" fill={color}/>
      <rect x="5" y="2.99997" width="10" height="2" fill={color}/>
      <rect x="5" y="15.0001" width="2" height="2" fill={color}/>
      <rect x="3" y="4.99997" width="2" height="10" fill={color}/>
      <rect x="15" y="5" width="2" height="4" fill={color}/>
    </svg>
  );
}
