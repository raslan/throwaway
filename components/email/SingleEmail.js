import useSWR from "swr";
import sanitizeHtml from "sanitize-html";
import { Box, Text, SlideFade, Flex, SkeletonText } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

const SingleEmail = ({ id, selected, ...props }) => {
  const { data: content, error } = useSWR(
    `https://www.1secmail.com/api/v1/?action=readMessage&login=${
      id.split("@")[0]
    }&domain=${id.split("@")[1]}&id=${selected}`
  );
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
      {error && <h1>no</h1>}
      {!error && !content && (
        <SkeletonText
          w='full'
          h='full'
          noOfLines={8}
          spacing='8'
          mt='4'
          overflow='scroll'
        />
      )}
      {content && (
        <>
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
                <Text fontSize='xl' my='0.5rem' fontWeight='bold'>
                  {content?.from}
                </Text>
                <Text fontWeight='semibold'>Subject: {content?.subject}</Text>
                <Text
                  mt='5'
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(content?.body, {
                      allowedAttributes: {
                        a: ["href"],
                      },
                    }),
                  }}
                />
              </Box>
            </SlideFade>
          </SkeletonText>
        </>
      )}
    </>
  );
};

export default SingleEmail;
