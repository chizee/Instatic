import React from 'react';
import type { IconProps } from '../types';

export function ItalicIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M11 18H12V20H6V18H9V14H11V18ZM13 14H11V10H13V14ZM15 10H13V6H12V4H18V6H15V10Z" fill={color}/>
    </svg>
  );
}
