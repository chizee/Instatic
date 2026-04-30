import React from 'react';
import type { IconProps } from '../types';

export function TextWrapSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="5" width="16" height="2" fill={color}/>
      <rect x="3" y="13" width="4" height="2" fill={color}/>
      <rect x="3" y="17" width="6" height="2" fill={color}/>
      <rect x="3" y="9" width="6" height="2" fill={color}/>
      <rect x="19" y="5" width="2" height="10" fill={color}/>
      <rect x="9" y="13" width="10" height="2" fill={color}/>
      <rect x="11" y="11" width="2" height="6" fill={color}/>
      <rect x="13" y="9" width="2" height="8" fill={color}/>
      <rect x="13" y="17" width="2" height="2" fill={color}/>
    </svg>
  );
}
