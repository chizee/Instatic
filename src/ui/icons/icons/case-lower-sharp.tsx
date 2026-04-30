import React from 'react';
import type { IconProps } from '../types';

export function CaseLowerSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="8" width="5" height="2" fill={color}/>
      <rect x="15" y="8" width="7" height="2" fill={color}/>
      <rect x="2" y="10" width="2" height="5" fill={color}/>
      <rect x="2" y="15" width="7" height="2" fill={color}/>
      <rect x="9" y="8" width="2" height="9" fill={color}/>
      <rect x="13" y="5" width="2" height="12" fill={color}/>
      <rect x="20" y="10" width="2" height="5" fill={color}/>
      <rect x="15" y="15" width="7" height="2" fill={color}/>
    </svg>
  );
}
