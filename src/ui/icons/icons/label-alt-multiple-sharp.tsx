import React from 'react';
import type { IconProps } from '../types';

export function LabelAltMultipleSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="7" y="7" width="2" height="6" fill={color}/>
      <rect x="3" y="11" width="2" height="6" fill={color}/>
      <rect x="7" y="5" width="11" height="2" fill={color}/>
      <rect x="18" y="7" width="2" height="2" fill={color}/>
      <rect x="20" y="9" width="2" height="2" fill={color}/>
      <rect x="18" y="11" width="2" height="2" fill={color}/>
      <rect x="7" y="13" width="11" height="2" fill={color}/>
      <rect x="3" y="17" width="11" height="2" fill={color}/>
      <rect x="3" y="9" width="4" height="2" fill={color}/>
      <rect x="14" y="15" width="2" height="4" fill={color}/>
    </svg>
  );
}
