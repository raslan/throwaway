export default function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className='persona-heading'>
      {children}
    </h1>
  );
}
