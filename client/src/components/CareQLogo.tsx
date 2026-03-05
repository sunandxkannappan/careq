interface CareQLogoProps {
  size?: number;
  className?: string;
}

export function CareQLogo({ size = 40, className }: CareQLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="4" y="4" width="92" height="92" rx="20" fill="currentColor" opacity="0.15" />
      <path
        d="M82 18H18C14.7 18 12 20.7 12 24V76C12 79.3 14.7 82 18 82H58L52 72H24C22.3 72 21 70.7 21 69V31C21 29.3 22.3 28 24 28H76C77.7 28 79 29.3 79 31V58C79 59 78.6 59.9 77.9 60.6L88 82V24C88 20.7 85.3 18 82 18Z"
        fill="currentColor"
      />
      <circle cx="52" cy="52" r="18" stroke="currentColor" strokeWidth="7" fill="none" />
      <line x1="64" y1="64" x2="82" y2="86" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}
