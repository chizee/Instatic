import React from 'react';
import type { IconProps } from '../types';

export function WashingMachineSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="2" width="18" height="2" fill={color}/>
      <rect x="3" y="20" width="18" height="2" fill={color}/>
      <rect x="3" y="4" width="2" height="16" fill={color}/>
      <rect x="19" y="4" width="2" height="16" fill={color}/>
      <rect x="9" y="17" width="6" height="2" fill={color}/>
      <rect x="7" y="11" width="2" height="6" fill={color}/>
      <rect x="9" y="9" width="6" height="2" fill={color}/>
      <rect x="15" y="11" width="2" height="6" fill={color}/>
      <rect x="15" y="6" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 10 12)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 12 14)" fill={color}/>
    </svg>
  );
}
