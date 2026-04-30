import React from 'react';
import type { IconProps } from '../types';

export function ChevronsVerticalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M13 20H11V18H13V20ZM11 18H9V16H11V18ZM15 18H13V16H15V18ZM9 16H7V14H9V16ZM17 14V16H15V14H17ZM9 10H7V8H9V10ZM17 10H15V8H17V10ZM11 8H9V6H11V8ZM15 8H13V6H15V8ZM13 6H11V4H13V6Z" fill={color}/>
    </svg>
  );
}
