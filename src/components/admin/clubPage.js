import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";
import { db } from "../config/firebase-config";
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  Select,
  Divider,
  Stack,
  Text,
  Spacer,
  Modal,
  VStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { getDocuments } from "../../FireBaseUtils/firebaseFunction";

const ClubPage = () => {
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [selectedAdmin1, setSelectedAdmin1] = useState([]);
  const [selectedAdmin2, setSelectedAdmin2] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [studentDetails, setStudentDetails] = useState([]);
  const [clubsList, setClubsList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clubToDelete, setClubToDelete] = useState(null);
  const [clubToUpdate, setClubToUpdate] = useState([]);
  const [showClubDetailsModal, setShowClubDetailsModal] = useState(false);

  const clubCollection = collection(db, "clubs")


  useEffect(() => {
    fetchStudentDetails2();
    fetchClubsList();
  }, []);

 

  // Function to fetch list of student details from Firestore
  const fetchStudentDetails2 = async (searchQuery = "") => {
    try {
      let querySnapshot;
      if (searchQuery) {
        // Create a query with the search criteria
        const q = query(
          collection(db, "studentDetails"),
          where("admissionNo", ">=", searchQuery),
          where("admissionNo", "<=", `${searchQuery}\uf8ff`)
        );
        querySnapshot = await getDocs(q);
      } else {
        // Fetch all student details
        querySnapshot = await getDocs(collection(db, "studentDetails"));
      }
      const students = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudentDetails(students);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  // Function to fetch list of clubs from Firestore
  const fetchClubsList = async () => {
    try {
      const clubs = await getDocuments(collection(db, "clubs"))
    //   const admins = await studentDetailsByID
      
      setClubsList(clubs);

      
    

      // Process the fetched admins data
    
    } catch (error) {
      console.error("Error fetching clubs list:", error);
    }


  };

  // Function to handle club creation
  const handleClubCreation = async () => {
    try {
    const collectionRef = collection(db, 'clubs');

    // Define your custom document ID
    const customDocId = clubName.trim();

    const parsedAdmin1 = JSON.parse(selectedAdmin1);
    const parsedAdmin2 = JSON.parse(selectedAdmin2);

    // Create a document reference with the custom ID
    const docRef = doc(collectionRef, customDocId);

    // Set the document with the custom ID
    await setDoc(docRef, {
      // Document data
      clubName: clubName,
      clubDescription: clubDescription,
      admins : {
        admin1: {id: parsedAdmin1.id,name: parsedAdmin1.name},
        admin2: {id: parsedAdmin2.id,name: parsedAdmin2.name}
      }
    });


      // Reset form fields
      setClubName("");
      setClubDescription("");
      setSelectedAdmin1("");
      setSelectedAdmin2("");

      // Refresh clubs list
      fetchClubsList();
    } catch (error) {
      console.error("Error creating club:", error);
    }
  };

  // Function to handle search
  const handleSearch = () => {
    fetchStudentDetails2(searchQuery);
  };

  // Function to handle club deletion
  const handleClubDeletion = async () => {
    try {
      // Delete the club document
      await deleteDoc(doc(db, "clubs", clubToDelete.id));
      // Refresh clubs list
      fetchClubsList();
      // Close modal
      onClose();
    } catch (error) {
      console.error("Error deleting club:", error);
    }
  };

  // Function to handle updating admins of the club
  const handleUpdateAdmins = async () => {
    try {
        console.log("hii")
    const parsedAdmin1 = JSON.parse(selectedAdmin1);
    const parsedAdmin2 = JSON.parse(selectedAdmin2);

    console.log(clubToUpdate.id)
    console.log(parsedAdmin1)

    const clubDocRef = doc(db, "clubs", clubToUpdate.id)

    await setDoc(clubDocRef, {
        admins : {
            admin1: {id: parsedAdmin1.id,name: parsedAdmin1.name},
            admin2: {id: parsedAdmin2.id,name: parsedAdmin2.name}
          }
    })

    console.log("Success")
    setSelectedAdmin1("")
    setSelectedAdmin2("")
    setShowClubDetailsModal(false);
    fetchClubsList()
    
    } catch (error) {
      console.error("Error updating club admins:", error);
    }
  };

    //   const adminDetailsFunction = async () =>{
    //     searchStudentByID()
    //     if (studentDoc.exists()) {
    //         // Document exists, retrieve the data
    //         const student = { id: studentDoc.id, ...studentDoc.data() };
    //         setStudentDetails([student]);
    //       } else {
    //         // Document does not exist
    //         console.log('Student not found');
    //         setStudentDetails([]);
    //       }
    //   }


  return (
    <Flex p="4" padding={{base: '40% 2% 2% 2%', md: '15% 5% 5% 5%', xl: '15% 5% 5% 5%'}}  
    backgroundColor="#213555">
      {/* Club Creation Section */}
      <Box w="60%" p="4" mr="2" backgroundColor="#fff" borderRadius="md">
        <Heading mb="4">Club Creation</Heading>
        <Stack spacing="4">
          <Input
            placeholder="Club Name"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
          />
          <Input
            placeholder="Club Description"
            value={clubDescription}
            onChange={(e) => setClubDescription(e.target.value)}
          />
          
          
<Text as="b">Create Admins : </Text>
<Flex direction="row">
    {/* First Admin Selection Section */}
    <Box mr="4">
        <Flex align="center">
            <Input
                placeholder="Search by Admission No."
                onChange={(e) => setSearchQuery(e.target.value)}
                mr="2"
            />
            <Button onClick={() => handleSearch()}>Search</Button>
        </Flex>
        <Select
            value={selectedAdmin1}

            placeholder="Select Admin 1"
            onChange={(e) => setSelectedAdmin1(e.target.value)}
            mt="2"
        >
            {studentDetails.map((student) => (
                <option key={student.id} value={JSON.stringify({ id: student.id, name: student.name })}>
                    {student.name}
                </option>
            ))}
        </Select>
            
    </Box>
    
    {/* Second Admin Selection Section */}
    <Box>
        <Flex align="center">
            <Input
                placeholder="Search by Admission No."
                onChange={(e) => setSearchQuery(e.target.value)}
                mr="2"
            />
            <Button onClick={() => handleSearch()}>Search</Button>
        </Flex>
        <Select
            placeholder="Select Admin 2"
            value={selectedAdmin2}
            onChange={(e) => setSelectedAdmin2(e.target.value)}
            mt="2"
        >
            {studentDetails.map((student) => (
                <option key={student.id}       
                value={JSON.stringify({ id: student.id, name: student.name })}
                >
                    {student.name}
                </option>
            ))}
        </Select>
    </Box>
</Flex>



          <Button onClick={handleClubCreation} colorScheme="blue">
            Create Club
          </Button>
        </Stack>
      </Box>

      {/* Clubs List Section */}
      <Box w="40%" backgroundColor="#fff" borderRadius='md' p='4'>
        <Heading mb="4">Clubs List</Heading>
        <Stack spacing="4">
          {clubsList.map((club) => (
            <Box>
            <Flex key={club.id} alignItems="center">
              <Text>{club.clubName}</Text>
              <Spacer />
              <Button
                colorScheme="red"
                mr="2"
                onClick={() => {
                  setClubToDelete(club);
                  onOpen();
                }}
              >
                Delete
              </Button>
              <Button
                colorScheme="blue"
                mr="2"
                onClick={() => {
                  setClubToUpdate(club);
                  setShowClubDetailsModal(true)
                  console.log(clubToUpdate)
                }}
              >
                Details
              </Button>
            </Flex>
            <Flex flexDir="column">
                <Text>Admin1: { club.admins.admin1.name}</Text>
                <Text>Admin2: { club.admins.admin2.name}</Text>

            </Flex>
                <Divider h="2px" borderWidth="1px" backgroundColor={"gray.700"}/>
            </Box>

          ))}
        </Stack>
        <Flex flexDir="row">
            <Text></Text>
            <Text></Text>
        </Flex>
      </Box>

      <Modal isOpen={showClubDetailsModal} onClose={() => setShowClubDetailsModal(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Club Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <Text>Club Name: {clubToUpdate.clubName}</Text>
                        <Text>Club ID: {clubToUpdate.id}</Text>
                        <Text>Club Description: {clubToUpdate.clubDescription}</Text>
                        {/* Add more club details as needed */}
                        <Flex align="center">
            <Input
                placeholder="Search by Admission No."
                onChange={(e) => setSearchQuery(e.target.value)}
                mr="2"
            />
            <Button onClick={() => handleSearch()}>Search</Button>
        </Flex>
                        <Select placeholder="Select Admin 1" value={selectedAdmin1} onChange={(e) => setSelectedAdmin1(e.target.value)}>
                            {/* Populate options with student details */}
                            {studentDetails.map((student) => (
                <option key={student.id} value={JSON.stringify({ id: student.id, name: student.name })}>
                    {student.name}
                </option>
            ))}
            
                        </Select>
                        <Flex align="center">
            <Input
            id="inputAdmin2"
                placeholder="Search by Admission No."
                onChange={(e) => setSearchQuery(e.target.value)}
                mr="2"
            />
            <Button onClick={() => handleSearch()}>Search</Button>
        </Flex>
                        <Select placeholder="Select Admin 2" value={selectedAdmin2} onChange={(e) => setSelectedAdmin2(e.target.value)}>
                        {studentDetails.map((student) => (
                <option key={student.id} value={JSON.stringify({ id: student.id, name: student.name })}>
                    {student.name}
                </option>
            ))}
                        </Select>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => handleUpdateAdmins()}>Update Admins</Button>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

      {/* Confirmation Modal for Club Deletion */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete the club "
            {clubToDelete && clubToDelete.clubName}"?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleClubDeletion}>
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ClubPage;
