import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Center,
  useToast,
} from "@chakra-ui/react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useLocation, useNavigate } from "react-router-dom";

const GrievanceList = () => {
  const [grievances, setGrievances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state;

  useEffect(() => {

    if (
        !data ||
        !data.identity ||
        data.identity !== "admin"
      ) {
        navigate("/login");
        return;
      }

    const fetchGrievances = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "grievances"));
        const grievanceData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGrievances(grievanceData);
      } catch (error) {
        console.error("Error fetching grievances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrievances();
  }, []);

  const handleDeleteGrievance = async (id) => {
    try {
      await deleteDoc(doc(db, "grievances", id));
      setGrievances((prevGrievances) =>
        prevGrievances.filter((grievance) => grievance.id !== id)
      );
      toast({
        title: "Grievance deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting grievance:", error);
      toast({
        title: "An error occurred.",
        description: "Failed to delete grievance.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p="4" padding={{base: '40% 2% 2% 2%', md: '12% 5% 5% 5%', xl: '12% 5% 5% 5%'}}  backgroundColor="#213555">
        <Center>
      <Heading as="h1" mb="4" color={'#fff'}>
        Grievance List
      </Heading>

      </Center>
      {isLoading ? (
        <Text>Loading grievances...</Text>
      ) : (
        grievances.length > 0 ? (
            <Center>
          <VStack align="stretch" spacing="4" w='70%'>
            {grievances.map((grievance) => (
              <Box
                key={grievance.id}
                p="4"
                borderWidth="1px"
                borderRadius="md"
                borderColor="gray.200"
                backgroundColor="white"
              >
                <Text as="b" fontSize="xl" mb="2">
                  {grievance.title}
                </Text>
                <Text  fontSize="lg" mb="2">
                  {grievance.complaintDetail}
                </Text>
                <Text>{grievance.content}</Text>
                <Text mt="2" fontSize="sm" color="gray.500">
                  By: {grievance.name} ({grievance.email})
                </Text>
                <Button
                  colorScheme="red"
                  size="sm"
                  mt="2"
                  onClick={() => handleDeleteGrievance(grievance.id)}
                >
                  Delete
                </Button>
              </Box>
            ))}
          </VStack>
          </Center>
        ) : (
          <Text>No grievances found.</Text>
        )
      )}
    </Box>
  );
};

export default GrievanceList;
