import React from 'react';
import type { IconProps } from '../types';

export function RadioHandheldIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="9" y="7" width="6" height="2" fill={color}/>
      <rect x="15" y="9" width="2" height="11" fill={color}/>
      <rect x="9" y="20" width="6" height="2" fill={color}/>
      <rect x="7" y="2" width="2" height="18" fill={color}/>
      <rect x="9" y="13" width="6" height="2" fill={color}/>
    </svg>
  );
}
