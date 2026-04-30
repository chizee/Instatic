import React from 'react';
import type { IconProps } from '../types';

export function GitCommitSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="7" y="7" width="10" height="2" fill={color}/>
      <rect x="7" y="9" width="2" height="6" fill={color}/>
      <rect x="7" y="15" width="10" height="2" fill={color}/>
      <rect x="15" y="9" width="2" height="6" fill={color}/>
      <rect y="11" width="5" height="2" fill={color}/>
      <rect x="19" y="11" width="5" height="2" fill={color}/>
    </svg>
  );
}
