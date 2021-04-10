import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  SlideFade,
  Flex,
  SkeletonText,
  SkeletonCircle,
} from "@chakra-ui/react";
import { ArrowBackIcon, EmailIcon } from "@chakra-ui/icons";
import { v4 } from "uuid";
import Link from "next/link";
import useSWR from "swr";
import SingleEmail from "../components/email/SingleEmail";

const generateEmail = () => {
  const g = `${v4().split`-`[0]}${Date.now()}@wwjmp.com`;
  window?.localStorage?.setItem("throwaway_email", JSON.stringify(g));
  return g;
};

const populateEmail = () => {
  let found = JSON.parse(window?.localStorage?.getItem("throwaway_email"));
  return found ? found : generateEmail();
};

const Email = (props) => {
  const [id, setId] = useState("");
  const { data: emails, error } = useSWR(
    `https://www.1secmail.com/api/v1/?action=getMessages&login=${
      id.split("@")[0]
    }&domain=${id.split("@")[1]}`
  );
  const [selected, setSelected] = useState("");
  const [mode, setMode] = useState("inbox");
  const newIdentity = async (id) => {
    setId(id);
  };
  const newEmail = async () => {
    const newId = generateEmail();
    newIdentity(newId);
  };
  useEffect(async () => {
    const newId = populateEmail();
    newIdentity(newId);
  }, []);
  return (
    <>
      {error && <h1>no</h1>}
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
            </Box>
            <Box w='full' overflow='scroll' rounded='lg' mt='3'>
              <Box w='full'>
                {(!emails && !error) ||
                  (!emails.length && (
                    <>
                      {Array(3)
                        .fill(1)
                        .map((_) => (
                          <>
                            <SkeletonCircle
                              size='5'
                              isLoaded={emails?.length > 0}
                              my='3'
                            />
                            <SkeletonText
                              noOfLines={3}
                              spacing='4'
                              isLoaded={emails?.length > 0}
                            />
                          </>
                        ))}
                    </>
                  ))}
                {emails &&
                  emails.map((email, index) => (
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
          <SingleEmail
            selected={selected}
            id={id}
            setMode={setMode}
            {...props}
          />
        )}
      </>
    </>
  );
};

export default Email;
