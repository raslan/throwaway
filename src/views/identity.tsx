import useIdentity from 'src/hooks/useIdentity';

const Identity = () => {
  const { identity, newIdentity } = useIdentity();
  return (
    <>
      <button className='bg-teal-700 py-2 w-full' onClick={() => newIdentity()}>
        new id
      </button>
    </>
  );
};

export default Identity;
