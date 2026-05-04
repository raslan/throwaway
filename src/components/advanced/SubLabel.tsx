const SubLabel = ({
  children,
  className = '',
}: {
  children: any;
  className?: string;
}) => (
  <span className={`block text-xs text-current opacity-70 ${className}`.trim()}>
    {children}
  </span>
);

export default SubLabel;
