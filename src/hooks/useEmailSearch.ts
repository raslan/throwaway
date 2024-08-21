import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Email } from 'src/types';

interface UseEmailSearchResult {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filteredEmails: Email[];
}

export const useEmailSearch = (emails: Email[]): UseEmailSearchResult => {
  const [search, setSearch] = useState('');
  const [filteredEmails, setFilteredEmails] = useState<Email[]>(emails);

  useEffect(() => {
    if (search) {
      const results = new Fuse(emails, {
        keys: ['subject', 'from', 'body_text', 'body_html', 'created_at'],
        minMatchCharLength: 4,
        distance: 4,
        threshold: 0.32,
        ignoreLocation: true,
      })
        .search(search)
        .map(({ item }) => item);
      setFilteredEmails(results);
    } else {
      setFilteredEmails(emails);
    }
  }, [search, emails]);

  return { search, setSearch, filteredEmails };
};
