import { Box, Flex, Text, Link, IconButton } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      as="footer"
      bg="#164B60"
      color="white"
      py={6}
      px={4}
      textAlign="center"
    >
      <Flex justify="center" align="center" mb={4}>
        <IconButton
          as={Link}
          href="#"
          aria-label="Facebook"
          icon={<FaFacebook />}
          variant="ghost"
          fontSize="20px"
          mr={2}
        />
        <IconButton
          as={Link}
          href="#"
          aria-label="Twitter"
          icon={<FaTwitter />}
          variant="ghost"
          fontSize="20px"
          mr={2}
        />
        <IconButton
          as={Link}
          href="#"
          aria-label="Instagram"
          icon={<FaInstagram />}
          variant="ghost"
          fontSize="20px"
        />
      </Flex>
      <Text fontSize="sm">
        © {new Date().getFullYear()} ABC Public School. All Rights Reserved.
      </Text>
      <Text fontSize="sm" mt={2}>
        Address: 123 School Street, Ranchi, India
      </Text>
      <Text fontSize="sm" mt={2}>
        Phone: (123) 456-7890 | Email: info@yourschool.com
      </Text>
    </Box>
  );
};

export default Footer;