import useIdentity from 'src/hooks/useIdentity';

const Identity = () => {
  const { identity, newIdentity } = useIdentity();
  return (
    <>
      <button className='bg-blue-500 px-4' onClick={() => newIdentity()}>
        new id
      </button>
    </>
  );
};

export default Identity;
