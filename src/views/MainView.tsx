import faker from "@faker-js/faker";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";
import EmailPreview from "src/components/EmailPreview";
import SearchBar from "src/components/SearchBar";
import { Email } from "src/types";

const emails = Array(100)
  .fill(1)
  .map((_) => ({
    subject: `${faker.hacker.phrase()} ${faker.hacker.phrase()}`,
    from: faker.hacker.noun(),
    body_text: faker.hacker.noun(),
    body_html: faker.hacker.ingverb(),
  }));

const fuse = new Fuse(emails, {
  keys: ["subject", "from"],
  minMatchCharLength: 3,
});

const MainView = () => {
  const [search, setSearch] = useState("");
  const [filteredEmails, setFilteredEmails] = useState<Email[]>(emails);

  useEffect(() => {
    if (search)
      setFilteredEmails(
        fuse
          .search(search)
          .map(({ item }) => item)
          .reverse() as Email[]
      );
    else setFilteredEmails(emails.reverse());
  }, [search]);

  return (
    <div className='flex flex-col w-full'>
      <section className='w-full max-w-md px-5 py-4 mx-auto rounded-md'>
        <SearchBar search={search} setSearch={setSearch} />
        <div className='flex flex-wrap h-[20rem] max-h-full overflow-y-scroll'>
          {filteredEmails.map((email, i) => (
            <EmailPreview subject={email.subject} from={email.from} key={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainView;
