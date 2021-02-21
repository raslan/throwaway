import Link from "next/link";
import { EmailIcon } from "@chakra-ui/icons";
import { Box, Container, Text, Flex, Img } from "@chakra-ui/react";
const Home = () => {
  return (
    <>
      <Container>
        <Flex
          direction='column'
          h='xs'
          alignItems='center'
          justifyContent='center'
        >
          <Img src='./t-bg-icon.png' />
        </Flex>
        <Link href='/email'>
          <Flex
            bg='blackAlpha.600'
            p='3'
            pl='0'
            alignItems='center'
            justifyContent='space-evenly'
            cursor='pointer'
          >
            <EmailIcon />
            <Text>Generate a secure email</Text>
          </Flex>
        </Link>
      </Container>
    </>
  );
};
export default Home;
