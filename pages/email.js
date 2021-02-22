import React, { useState, useEffect } from "react";
import sanitizeHtml from "sanitize-html";

import {
  Box,
  Button,
  Text,
  SlideFade,
  Flex,
  SkeletonText,
  SkeletonCircle,
} from "@chakra-ui/react";

import { v4 } from "uuid";
import axios from "axios";
import Link from "next/link";
import { ArrowBackIcon, EmailIcon, RepeatIcon } from "@chakra-ui/icons";

const generateEmail = () => {
  const g = `${v4().split`-`[0]}${Date.now()}@wwjmp.com`;
  window?.localStorage?.setItem("throwaway_email", JSON.stringify(g));
  return g;
};

const populateEmail = () => {
  let found = JSON.parse(window?.localStorage?.getItem("throwaway_email"));
  return found ? found : generateEmail();
};

const read = async (id) =>
  await (
    await axios.get(
      `https://www.1secmail.com/api/v1/?action=getMessages&login=${id[0]}&domain=${id[1]}`
    )
  ).data;

const readOne = async (id, selected) =>
  await (
    await axios.get(
      `https://www.1secmail.com/api/v1/?action=readMessage&login=${id[0]}&domain=${id[1]}&id=${selected}`
    )
  ).data;

const SingleEmail = (props) => {
  const [content, setContent] = useState({});
  useEffect(async () => {
    setContent(await readOne(props.id.split("@"), props.selected));
  }, []);
  return (
    <>
      <Flex alignItems='center' my='3' w='full'>
        <ArrowBackIcon
          w={6}
          h={6}
          cursor='pointer'
          onClick={() => props.setMode("inbox")}
        />
      </Flex>
      <SkeletonText
        w='full'
        h='full'
        noOfLines={8}
        spacing='8'
        mt='4'
        isLoaded={content.body}
        overflow='scroll'
      >
        <SlideFade in={true}>
          <Box h='full'>
            <Text fontSize='lg'>from: {content?.from}</Text>
            <Text fontWeight='semibold'>subject: {content?.subject}</Text>
            <Box
              mt='5'
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content?.body) }}
            />
          </Box>
        </SlideFade>
      </SkeletonText>
    </>
  );
};

const Email = () => {
  const [id, setId] = useState("");
  const [emails, setEmails] = useState([]);
  const [selected, setSelected] = useState("");
  const [mode, setMode] = useState("inbox");
  const [worker, setWorker] = useState(null);
  const newIdentity = async (id) => {
    setId(id);
    setEmails(await read(id.split("@")));
    setWorker(
      setInterval(async () => setEmails(await read(id.split("@"))), 5000)
    );
  };
  const newEmail = async () => {
    clearInterval(worker);
    const newId = generateEmail();
    newIdentity(newId);
  };
  useEffect(async () => {
    const newId = populateEmail();
    newIdentity(newId);
  }, []);
  return (
    <>
      {mode === "inbox" && (
        <>
          <Box w='full'>
            <Flex alignItems='center' my='3'>
              <Link href='/'>
                <ArrowBackIcon w={6} h={6} cursor='pointer' />
              </Link>

              <Text mx='8' textAlign='center' fontSize='xl' fontWeight='bold'>
                Email
              </Text>
            </Flex>
            <Box
              fontWeight='bold'
              fontSize='sm'
              textAlign='center'
              bg='blackAlpha.600'
              p='3'
              rounded='lg'
              w='full'
              my='3.5'
              mt='7'
              onClick={(e) => {
                navigator.clipboard.writeText(id);
                const range = document.createRange();
                range.selectNodeContents(e.target);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
              }}
            >
              {id}
            </Box>
            <Button
              onClick={() => {
                newEmail();
              }}
              colorScheme='blackAlpha'
              w='full'
            >
              Generate A New Email
            </Button>
          </Box>
          <Box
            w='full'
            mt='12'
            textAlign='center'
            display='flex'
            justifyContent='space-between'
          >
            <Text fontSize='lg' fontWeight='bold' alignItems='center'>
              Inbox
            </Text>
            <RepeatIcon
              cursor='pointer'
              w={6}
              h={6}
              onClick={async () => setEmails(await read(id.split("@")))}
            />
          </Box>
          <Box w='full' overflow='scroll' rounded='lg' mt='3'>
            <Box w='full'>
              {emails.length === 0 && (
                <>
                  {Array(3)
                    .fill(1)
                    .map((_) => (
                      <>
                        <SkeletonCircle
                          size='5'
                          isLoaded={emails.length > 0}
                          my='3'
                        />
                        <SkeletonText
                          noOfLines={3}
                          spacing='4'
                          isLoaded={emails.length > 0}
                        />
                      </>
                    ))}
                </>
              )}
              {emails.map((email, index) => (
                <SlideFade in={true}>
                  <Box
                    id={`email-${index}`}
                    key={index}
                    w='full'
                    p='6'
                    my='2'
                    bgColor='blackAlpha.600'
                    rounded='lg'
                    cursor='pointer'
                    onClick={() => {
                      setMode("email");
                      setSelected(email.id);
                    }}
                    display='flex'
                    alignItems='center'
                  >
                    <EmailIcon w={6} h={6} />
                    <Flex direction='column' ml='6'>
                      <Text fontWeight='bold'>{email.from}</Text>
                      <Text fontSize='lg' mt='1'>
                        {email.subject}
                      </Text>
                      <Text fontSize='sm' mt='1'>
                        {email.date}
                      </Text>
                    </Flex>
                  </Box>
                </SlideFade>
              ))}
            </Box>
          </Box>
        </>
      )}
      {mode === "email" && (
        <SingleEmail selected={selected} id={id} setMode={setMode} />
      )}
    </>
  );
};

export default Email;
