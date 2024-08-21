export default function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl flex gap-2 items-center'>
      {children}
    </h1>
  );
}
