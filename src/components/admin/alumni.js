import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  Text,
  Modal,
  Flex,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Center,
  ModalCloseButton,
  Input,
  Stack,
} from "@chakra-ui/react";
import { getAuth, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import {  doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { auth } from "../config/firebase-config";

const AlumniDashboard = () => {
  const [userData, setUserData] = useState({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [githubLink, setGithubLink] = useState("");
  const [linkedInLink, setLinkedInLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const navigate = useNavigate();

  const auth = getAuth();

  const location = useLocation();
  const alumniDetail = location.state;
  console.log(alumniDetail)

  useEffect(()=>{

    if (
        !alumniDetail ||
        !alumniDetail.identity ||
        alumniDetail.identity !== "alumni"
      ) {
        navigate("/login");
        return;
      }
    setUserData(alumniDetail)
    console.log(alumniDetail)
  }, [])




  // Function to handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  
  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "alumni", `alumni${userData.email}`));
      if (userDoc.exists()) {
        const userData1 = userDoc.data(); // Convert document snapshot to data
        setUserData(userData1);
        console.log(userData)
      } else {
        console.log("User document does not exist");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  
  // Function to handle updating user information
  const handleUpdateInformation = async () => {
    try {
      await setDoc(doc(db, "alumni", `alumni${userData.email}`), {
        ...userData,
        githubLink,
        linkedInLink,
        websiteLink,
      });
      // Close the modal and refresh user data
      setIsUpdateModalOpen(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  return (
    <Center height="auto" backgroundColor="#213555">
      <Box p="4" w="100%" paddingTop="10%" backgroundColor="#213555" textAlign="center">
        <Heading as="h1" mb="4" color="#fff">
          Alumni Dashboard
        </Heading>

        {/* Update button */}
        <Box mb="3%">
        <Button
          mt="4"
          mr="4"
          colorScheme="blue"
          onClick={() => setIsUpdateModalOpen(true)}
        >
          Update Information
        </Button>
        

        {/* Sign-out button */}
        <Button mt="4" colorScheme="red" onClick={handleSignOut}>
          Sign Out
        </Button>
        </Box>

        {/* Display user details */}
       

        <Flex
  marginTop="10%"
  p="4"
  borderWidth="1px"
  borderRadius="md"
  borderColor="gray.200"
  backgroundColor="white"
  textAlign="left"
  width="50%"
  margin="auto"
  flexDirection="column"
>
  <Box width="100%">
    <Heading as="h2" size="md" mb="4" width="40%">
      Your Details
    </Heading>
    <Flex justifyContent="space-between">
      <Text flexBasis="40%" textAlign="left" fontWeight="bold">Name:</Text>
      <Text flexBasis="60%" textAlign="left">{userData.name}</Text>
    </Flex>
    <Flex justifyContent="space-between">
      <Text flexBasis="40%" textAlign="left" fontWeight="bold">Company Name:</Text>
      <Text flexBasis="60%" textAlign="left">{userData.companyName}</Text>
    </Flex>
    <Flex justifyContent="space-between">
      <Text flexBasis="40%" textAlign="left" fontWeight="bold">Role in Company:</Text>
      <Text flexBasis="60%" textAlign="left">{userData.roleInCompany}</Text>
    </Flex>
    <Flex justifyContent="space-between">
      <Text flexBasis="40%" textAlign="left" fontWeight="bold">Year of Passout:</Text>
      <Text flexBasis="60%" textAlign="left">{userData.yearOfPassout}</Text>
    </Flex>
    <Flex justifyContent="space-between">
      <Text flexBasis="40%" textAlign="left" fontWeight="bold">Email:</Text>
      <Text flexBasis="60%" textAlign="left">{userData.email}</Text>
    </Flex>
    <Flex justifyContent="space-between">
      <Text flexBasis="40%" textAlign="left" fontWeight="bold">Github:</Text>
      <Text flexBasis="60%" textAlign="left">{userData.githubLink}</Text>
    </Flex>
    <Flex justifyContent="space-between">
      <Text flexBasis="40%" textAlign="left" fontWeight="bold">LinkedIn:</Text>
      <Text flexBasis="60%" textAlign="left">{userData.linkedInLink}</Text>
    </Flex>
    <Flex justifyContent="space-between">
      <Text flexBasis="40%" textAlign="left" fontWeight="bold">Website:</Text>
      <Text flexBasis="60%" textAlign="left">{userData.websiteLink}</Text>
    </Flex>
  </Box>
</Flex>


        {/* Update information modal */}
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Information</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <Input
                  placeholder="Github Link"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                />
                <Input
                  placeholder="LinkedIn Link"
                  value={linkedInLink}
                  onChange={(e) => setLinkedInLink(e.target.value)}
                />
                <Input
                  placeholder="Website Link"
                  value={websiteLink}
                  onChange={(e) => setWebsiteLink(e.target.value)}
                />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleUpdateInformation}>
                Update
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Center>
  );
};

export default AlumniDashboard;

