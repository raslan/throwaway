const ThrowawayIcon = ({ className }: { className?: string }) => (
  <svg
    width={32}
    height={32}
    className={className}
    viewBox='0 0 64 64'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <rect x='4' y='4' width='56' height='56' rx='8' fill='currentColor' />
    <rect x='10' y='10' width='44' height='44' rx='5' stroke='#050608' strokeWidth='2' />
    <rect x='16' y='16' width='32' height='32' rx='4' fill='#050608' />
    <path
      d='M24 38C24 31.4 27.6 27.5 32 27.5C36.4 27.5 40 31.4 40 38'
      stroke='#fff'
      strokeWidth='2.5'
      strokeLinecap='round'
    />
    <path
      d='M27.5 39C27.5 34.2 29.5 31.5 32 31.5C34.5 31.5 36.5 34.2 36.5 39'
      stroke='#fff'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M31.8 36V43'
      stroke='#fff'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M22.5 30.5C24.5 25.5 28 23 32 23C36 23 39.5 25.5 41.5 30.5'
      stroke='#fff'
      strokeWidth='2'
      strokeLinecap='round'
      opacity='0.86'
    />
    <path
      d='M18.5 31.5C21.1 23.5 26.2 19.5 32 19.5C37.8 19.5 42.9 23.5 45.5 31.5'
      stroke='#fff'
      strokeWidth='2'
      strokeLinecap='round'
      opacity='0.62'
    />
    <path d='M18 46H46' stroke='#f4f1e8' strokeWidth='2' strokeLinecap='round' />
    <rect x='42' y='16' width='6' height='6' rx='1' fill='#050608' />
  </svg>
);

export default ThrowawayIcon;
