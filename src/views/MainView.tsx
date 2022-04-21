import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import EmailDialog from "src/components/EmailDialog";
import EmailPreview from "src/components/EmailPreview";
import InboxIcon from "src/components/InboxIcon";
import SearchBar from "src/components/SearchBar";
import SpinnerIcon from "src/components/SpinnerIcon";
import useEmail from "src/hooks/useEmail";
import { Email } from "src/types";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "usehooks-ts";
import FillIcon from "src/components/FillIcon";

const MainView = () => {
  const { email, emails, loading, getNewEmail, otp } = useEmail();
  const [isOpen, setIsOpen] = useState(false);
  const [emailData, setEmailData] = useState<Email>();
  const [, copy] = useCopyToClipboard();
  const fuse = useMemo(
    () =>
      new Fuse(emails, {
        keys: ["subject", "from"],
        minMatchCharLength: 4,
        distance: 4,
        threshold: 0.32,
        ignoreLocation: true,
      }),
    [emails]
  );

  const [search, setSearch] = useState("");
  const [filteredEmails, setFilteredEmails] = useState<Email[]>(emails);

  useEffect(() => {
    setFilteredEmails(emails);
  }, [emails]);

  useEffect(() => {
    if (otp) {
      toast(
        (t) => (
          <div className='flex flex-col bg-white rounded-2xl -ml-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='flex flex-col ml-3'>
                  <div className='font-medium leading-none'>
                    Detected Verification Code
                  </div>
                  <p className='text-xs text-gray-600 leading-none mt-1'>
                    You can copy it or press fill to fill it automatically.
                  </p>
                </div>
              </div>
              <button
                className='flex-no-shrink bg-purple-500 px-5 ml-4 py-1 text-xs hover:bg-purple-800 font-medium tracking-wider border-2 border-purple-500 text-white rounded-full'
                onClick={() => {
                  copy(otp);
                  toast.dismiss(t.id);
                  toast.success("Copied to clipboard");
                }}
              >
                Copy
              </button>
            </div>
          </div>
        ),
        {
          icon: <FillIcon />,
          duration: 6000,
          id: "otp",
        }
      );
    }
  }, [otp]);

  useEffect(() => {
    if (search)
      setFilteredEmails(fuse.search(search).map(({ item }) => item) as Email[]);
    else setFilteredEmails(emails);
  }, [search]);

  return (
    <div className='flex flex-col w-full'>
      <section className='w-full max-w-md px-5 py-4 mx-auto rounded-md'>
        <div className='grid grid-cols-12 w-full justify-between items-center gap-4'>
          <SearchBar
            className='col-span-10'
            search={search}
            setSearch={setSearch}
          />
          <button
            onClick={() => {
              getNewEmail();
              toast.success("Created a new email!");
            }}
          >
            <InboxIcon />
          </button>
          {loading && <SpinnerIcon />}
        </div>
        <div className='flex flex-wrap h-[20rem] max-h-full overflow-y-scroll content-start mt-4 pb-5'>
          {!loading && filteredEmails.length === 0 && (
            <div className='flex flex-col w-full h-3/4 items-center justify-center'>
              <div>
                <h1 className='text-3xl text-gray-400'>Inbox is empty</h1>
                <div className='mt-3'>
                  <SpinnerIcon />
                </div>
              </div>
              <p className='text-gray-400 mt-3'>
                Your email is{" "}
                <button
                  onClick={() => {
                    copy(email);
                    toast.success("Copied to clipboard");
                  }}
                  className='text-purple-300 hover:underline'
                >
                  {email}
                </button>
              </p>
            </div>
          )}
          {filteredEmails.map((email, i) => (
            <EmailPreview
              subject={email.subject}
              from={email.from}
              key={i}
              onClick={() => {
                setEmailData(email);
                setIsOpen(true);
              }}
            />
          ))}
        </div>
        <EmailDialog
          emailData={emailData as Email}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </section>
    </div>
  );
};

export default MainView;
