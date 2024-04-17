import { Box, Image, Text, Container, Flex, Center } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import AOS from "aos";

const Principal = () => {
  const [isMobileResponsive, setIsMobileResponsive] = useState(
    window.innerWidth < 700 ? true : false
  );


  useEffect(() => {
    AOS.init();
  }, [])
  useEffect(() => {
    const handleWindowResize = () => {
      window.innerWidth < 700
        ? setIsMobileResponsive(true)
        : setIsMobileResponsive(false);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  console.log(isMobileResponsive);
  return (
    <>
      <Box
        zIndex="-1"
        w="100%"
        h="30vh"
        borderBottomRadius="15px"
        backgroundColor="#164B60"
        position="relative"
      >
        <Text
          mb="5vh"
          color="white"
          fontSize="3xl"
          as="b"
          position="absolute"
          bottom="5px"
          left="35vw"
        >
          From the Principal's Desk
        </Text>
      </Box>
      <Center>
        <Flex
          flexDir={`${isMobileResponsive ? "column" : "row"}`}
          maxW="1200px"
          mb="10"
          w="100%"
          justify="flex-start"
        >
          <Flex
            w={`${isMobileResponsive ? "100vw" : "30vw"}`}
            align="center"
            justify="space-between"
            position="relative"
            bottom="3vh"
            data-aos='zoom-in'
          >
            <Image
              objectFit="cover"
              width={`${isMobileResponsive ? "45%" : "30vw"}`}
              height={`${isMobileResponsive ? "auto" : "70vh"}`}
              src="images\principalphoto.jpg"
              boxShadow={"2xl"}
              borderRightRadius={`${isMobileResponsive ? "20px" : ""}`}
              borderRadius={`${isMobileResponsive ? "" : "20px"}`}
            ></Image>

            {isMobileResponsive === true && (
              <Box w="60%">
                <Center>
                  <Text as="i" fontSize="xl">
                    Mr./Mrs. XYZ Singh
                  </Text>
                </Center>
              </Box>
            )}
          </Flex>
          <Box
            w={`${isMobileResponsive ? "" : "70vw"}`}
            maxW={`${isMobileResponsive ? "100%" : "70vw"}`}
          >
            <Container
              fontSize="lg"
              position="relative"
              right="0"
              ml="5%"
              m="1%"
              data-aos="zoom-in"
            >
              <Text fontSize="xl" as="b">
                Dear Visitor <br /> <br />
              </Text>
              I am delighted to extend my heartfelt congratulations to the
              entire [School Name] community as we celebrate a legacy of
              excellence and achievement. Our school has always been a nurturing
              ground for innovation, growth, and holistic development, and it's
              with great pride that I acknowledge the collective efforts that
              have propelled us to this point. Our commitment to fostering a
              well-rounded education, characterized by both academic rigor and
              character building, has borne fruit once again. The achievements
              we celebrate today are a reflection of the dedication and hard
              work of our students, the guidance and expertise of our educators,
              and the unwavering support of our parents. As we revel in these
              accomplishments, let us also be reminded that our journey towards
              greatness continues. <br />
            </Container>
            <Text
              fontSize="xl"
              position="relative"
              mt="3"
              right={`${isMobileResponsive ? "-60vw" : "-430px"}`}
              left={`${isMobileResponsive ? "" : ""}`}
              textAlign="right"
              as="b"
            >
              Mrs. XYZ <br /> Principal
            </Text>
          </Box>
        </Flex>
      </Center>
    </>
  );
};

export default Principal;
