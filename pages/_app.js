import { ChakraProvider, Box, Container } from "@chakra-ui/react";

import "../styles/globals.css";

function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Box
        bg='gray.800'
        w='35vw'
        minW='400px'
        maxW='600px'
        h='80vh'
        minH='xl'
        maxH='2xl'
        p={4}
        color='white'
      >
        <Container h='full' w='full' p='6' centerContent>
          <Component {...pageProps} />
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
