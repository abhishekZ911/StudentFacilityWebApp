import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  ModalHeader,
  Center,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import {  useLocation, useNavigate } from "react-router-dom";

const ExploreAlumni = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate()
  const data = location.state;

  useEffect(() => {

    if (
        !data ||
        !data.identity ||
        data.identity !== "student"
      ) {
        navigate("/login");
        return;
      }
    const fetchAlumni = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(collection(db, "alumni"));
        const alumniData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlumni(alumniData);
        setFilteredAlumni(alumniData);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  useEffect(() => {
    const filterAlumni = () => {
      const filteredData = alumni.filter(
        (alumnus) =>
          alumnus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alumnus.companyName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          alumnus.roleInCompany
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredAlumni(filteredData);
    };

    filterAlumni();
  }, [searchQuery, alumni]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAlumniClick = (alumnus) => {
    setSelectedAlumni(alumnus);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box
      p="4"
      padding={{ base: "40% 2% 2% 2%", md: "12% 5% 5% 5%", xl: "12% 5% 5% 5%" }}
      backgroundColor="#213555"
    >
      <Center>
        <Heading as="h1" mb="4" color="#fff">
          Explore Alumni
        </Heading>
      </Center>

      <Center>
        <InputGroup mb="4" maxWidth="400px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search alumni by name, company, or role"
            value={searchQuery}
            onChange={handleSearch}
          />
        </InputGroup>
      </Center>
      <Center>
        <Stack spacing="4" w="50%">
          {isLoading ? (
            <Center>
              <Text fontSize="xl" color="#fff">
                Loading alumni...
              </Text>
            </Center>
          ) : filteredAlumni.length > 0 ? (
            filteredAlumni.map((alumnus) => (
              <Box
                key={alumnus.id}
                p="4"
                borderWidth="1px"
                borderRadius="md"
                borderColor="gray.200"
                backgroundColor="white"
                onClick={() => handleAlumniClick(alumnus)}
                cursor="pointer"
              >
                <Heading as="h2" size="md" mb="2">
                  {alumnus.name}
                </Heading>
                <Text>Company: {alumnus.companyName}</Text>
                <Text>Role: {alumnus.roleInCompany}</Text>
              </Box>
            ))
          ) : (
            <Text>No alumni found.</Text>
          )}
        </Stack>
      </Center>

      {selectedAlumni && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedAlumni.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Email */}
              <Flex>
                <Box flex="30%">
                  <Text fontWeight="bold">Email:</Text>
                </Box>
                <Box flex="70%">
                  <Text>{selectedAlumni.email}</Text>
                </Box>
              </Flex>

              {/* Company */}
              <Flex>
                <Box flex="30%">
                  <Text fontWeight="bold">Company:</Text>
                </Box>
                <Box flex="70%">
                  <Text>{selectedAlumni.companyName}</Text>
                </Box>
              </Flex>

              {/* Role */}
              <Flex>
                <Box flex="30%">
                  <Text fontWeight="bold">Role:</Text>
                </Box>
                <Box flex="70%">
                  <Text>{selectedAlumni.roleInCompany}</Text>
                </Box>
              </Flex>

              {/* Year of Passout */}
              <Flex>
                <Box flex="30%">
                  <Text fontWeight="bold">Year of Passout:</Text>
                </Box>
                <Box flex="70%">
                  <Text>{selectedAlumni.yearOfPassout}</Text>
                </Box>
              </Flex>

              {/* LinkedIn Link */}
              <Flex>
                <Box flex="30%">
                  <Text fontWeight="bold">LinkedIn:</Text>
                </Box>
                <Box flex="70%">
                  <Text>{selectedAlumni.linkedInLink}</Text>
                </Box>
              </Flex>

              {/* Github Link */}
              <Flex>
                <Box flex="30%">
                  <Text fontWeight="bold">Github:</Text>
                </Box>
                <Box flex="70%">
                  <Text>{selectedAlumni.githubLink}</Text>
                </Box>
              </Flex>

              {/* Website Link */}
              <Flex>
                <Box flex="30%">
                  <Text fontWeight="bold">Website:</Text>
                </Box>
                <Box flex="70%">
                  <Text>{selectedAlumni.websiteLink}</Text>
                </Box>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default ExploreAlumni;
