import Link from "next/link";
import { EmailIcon, RepeatIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import Cards from "react-credit-cards";
import { new_card } from "../utils/generate_card";
import "react-credit-cards/es/styles-compiled.css";
import {
  Box,
  Container,
  Flex,
  Avatar,
  SimpleGrid,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { v4 } from "uuid";

const Inbox = () => (
  <Link href='/email'>
    <Flex alignItems='center' justifyContent='space-evenly' cursor='pointer'>
      <EmailIcon
        boxSize={7}
        _hover={{
          color: "yellow.300",
        }}
      />
    </Flex>
  </Link>
);
const generateUser = async () => {
  const g = await (
    await (await fetch(`https://randomuser.me/api/?seed=${v4()}`)).json()
  ).results[0];
  window?.localStorage?.setItem("throwaway_user", JSON.stringify(g));
  return g;
};

const populateUser = async () => {
  let found = JSON.parse(window?.localStorage?.getItem("throwaway_user"));
  return found ? found : await generateUser();
};

const Home = () => {
  const [user, setUser] = useState({});
  const [focus, setFocus] = useState("number");
  const [cardInfo, setCardInfo] = useState({
    cvc: `${Math.floor(Math.random() * 899) + 100}`,
    expiry: `0${Math.floor(Math.random() * 8) + 1}/${
      Math.floor(Math.random() * 7) + 22
    }`,
    number: new_card(),
  });
  useEffect(async () => {
    const newUser = await populateUser();
    setUser(newUser);
  }, []);
  return (
    <>
      <Container height='full' overflow='scroll'>
        <Flex direction='column' h='xs'>
          <Flex w='full' justifyContent='space-between' alignItems='center'>
            <Avatar
              name={`${user?.name?.first} ${user?.name?.last}`}
              src={`${user?.picture?.medium}`}
              size='lg'
            />
            <Box>
              <Flex w='full' justifyContent='space-between' alignItems='center'>
                <Box>
                  <Flex
                    alignItems='center'
                    justifyContent='space-evenly'
                    cursor='pointer'
                    _hover={{
                      color: "yellow.300",
                    }}
                    onClick={async () => {
                      setUser(await generateUser());
                      setCardInfo({
                        cvc: `${Math.floor(Math.random() * 899) + 100}`,
                        expiry: `0${Math.floor(Math.random() * 8) + 1}/${
                          Math.floor(Math.random() * 7) + 22
                        }`,
                        number: new_card(),
                      });
                    }}
                  >
                    <RepeatIcon boxSize={7} mx='5' />
                  </Flex>
                </Box>
                <Box>
                  <Inbox />
                </Box>
              </Flex>
            </Box>
          </Flex>
          <Box
            mt='6'
            fontSize='2xl'
            fontWeight='bold'
          >{`${user?.name?.first} ${user?.name?.last}`}</Box>
          <Accordion mt='4' defaultIndex={[0]} allowToggle>
            <AccordionItem border='0px'>
              <h2>
                <AccordionButton>
                  <Box
                    flex='1'
                    textAlign='left'
                    fontWeight='bold'
                    fontSize='lg'
                  >
                    Basic Information
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <SimpleGrid columns={2} spacing={4} mt='4'>
                  <Box fontWeight='bold' color='yellow.300'>
                    Phone Number:{" "}
                  </Box>
                  <Box>{user?.phone}</Box>
                  <Box fontWeight='bold' color='yellow.300'>
                    Birthday:{" "}
                  </Box>
                  <Box>{user?.dob?.date?.substring(0, 10)}</Box>
                  <Box>
                    <ChakraLink
                      fontWeight='bold'
                      href={`${user?.picture?.large}`}
                      isExternal
                    >
                      Profile Picture <ExternalLinkIcon mx='2px' />
                    </ChakraLink>
                  </Box>
                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border='0px' mt='2'>
              <h2>
                <AccordionButton>
                  <Box
                    flex='1'
                    textAlign='left'
                    fontWeight='bold'
                    fontSize='lg'
                  >
                    Address
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <SimpleGrid columns={2} spacing={4} mt='4'>
                  <Box fontWeight='bold' color='yellow.300'>
                    Street:{" "}
                  </Box>
                  <Box>{`${user?.location?.street?.number} ${user?.location?.street?.name}`}</Box>
                  <Box fontWeight='bold' color='yellow.300'>
                    City:{" "}
                  </Box>
                  <Box>{`${user?.location?.city}`}</Box>
                  <Box fontWeight='bold' color='yellow.300'>
                    State:{" "}
                  </Box>
                  <Box>{`${user?.location?.state}`}</Box>
                  <Box fontWeight='bold' color='yellow.300'>
                    Postal/Zip Code:{" "}
                  </Box>
                  <Box>{`${user?.location?.postcode}`}</Box>
                  <Box fontWeight='bold' color='yellow.300'>
                    Country:{" "}
                  </Box>
                  <Box>{`${user?.location?.country}`}</Box>
                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border='0px' mt='2'>
              <h2>
                <AccordionButton>
                  <Box
                    flex='1'
                    textAlign='left'
                    fontWeight='bold'
                    fontSize='lg'
                  >
                    Credit Card
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} px={0}>
                <Box id='PaymentForm' display='flex' alignItems='center'>
                  <Box m='auto'>
                    <Box
                      cursor='pointer'
                      _hover={{
                        color: "yellow.300",
                      }}
                      onClick={() => {
                        focus === "cvc" ? setFocus(false) : setFocus("cvc");
                      }}
                    >
                      <Flex
                        w='full'
                        justifyContent='flex-end'
                        alignItems='center'
                        mb='3'
                      >
                        <svg
                          width='36'
                          height='36'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M4.99255 11.0159C4.44027 11.0159 3.99255 10.5682 3.99255 10.0159C3.99255 9.6585 4.18004 9.3449 4.46202 9.16807L7.14964 6.48045C7.54016 6.08993 8.17333 6.08993 8.56385 6.48045C8.95438 6.87098 8.95438 7.50414 8.56385 7.89467L7.44263 9.0159L14.9926 9.01589C15.5448 9.01589 15.9926 9.46361 15.9926 10.0159C15.9926 10.5682 15.5448 11.0159 14.9926 11.0159L5.042 11.0159C5.03288 11.016 5.02376 11.016 5.01464 11.0159H4.99255Z'
                            fill='currentColor'
                          />
                          <path
                            d='M19.0074 12.9841C19.5597 12.9841 20.0074 13.4318 20.0074 13.9841C20.0074 14.3415 19.82 14.6551 19.538 14.8319L16.8504 17.5195C16.4598 17.9101 15.8267 17.9101 15.4361 17.5195C15.0456 17.129 15.0456 16.4958 15.4361 16.1053L16.5574 14.9841H9.00745C8.45516 14.9841 8.00745 14.5364 8.00745 13.9841C8.00745 13.4318 8.45516 12.9841 9.00745 12.9841L18.958 12.9841C18.9671 12.984 18.9762 12.984 18.9854 12.9841H19.0074Z'
                            fill='currentColor'
                          />
                        </svg>
                        <Box fontSize='lg' fontWeight='bold'>
                          Flip
                        </Box>
                      </Flex>
                    </Box>
                    <Flex alignItems='center' justifyContent='center'>
                      <Cards
                        cvc={cardInfo.cvc}
                        expiry={cardInfo.expiry}
                        focused={focus}
                        name={`${user?.name?.first} ${user?.name?.last}`}
                        number={cardInfo.number}
                      />
                    </Flex>
                  </Box>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>
      </Container>
    </>
  );
};
export default Home;
