import FillButton from "src/components/FillButton";
import useIdentity from "src/hooks/useIdentity";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import toast from "react-hot-toast";

const IdentityView = () => {
  const { identity, newIdentity } = useIdentity();
  return (
    <div className='flex flex-col w-full px-12'>
      <div className='grid grid-cols-2 gap-3 w-full justify-around my-3'>
        <FillButton fillData={identity} />
        <button
          onClick={() => {
            newIdentity();
            toast.success("New identity created!");
          }}
          className='px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform rounded-md bg-slate-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80'
        >
          New
        </button>
      </div>
      <div className='grid grid-cols-2 gap-4 h-[20rem] max-h-full overflow-y-scroll'>
        {identity &&
          Object.entries(identity)
            .sort()
            .map(([key, value]) => (
              <div key={key}>
                <div className='font-bold capitalize text-purple-400 mb-1 text-sm'>
                  {key.split(".").join(" ")}
                </div>
                <div>{typeof value === "string" ? value : ""}</div>
              </div>
            ))}
        <div className='col-span-2'>
          <Cards
            cvc={identity?.card_verification}
            expiry={identity?.card_expiry}
            name={identity?.name}
            number={identity?.card_number}
          />
        </div>
      </div>
    </div>
  );
};

export default IdentityView;
