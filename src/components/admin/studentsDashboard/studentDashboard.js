import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
} from "@chakra-ui/react";
import { db } from "../../config/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { PiSignOutBold } from "react-icons/pi";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";

const StudentDashboard = () => {
  const [notices, setNotices] = useState([]);
  const auth = getAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const studentDataFromLogin = location.state;

  console.log(studentDataFromLogin);

  useEffect(() => {
    if (
      !studentDataFromLogin ||
      !studentDataFromLogin.identity ||
      studentDataFromLogin.identity !== "student"
    ) {
      navigate("/login");
      return;
    }

    const fetchNotices = async () => {
      const notificationRef = collection(db, "news");
      try {
        const noticeList = await getDocs(notificationRef);
        const filteredData = noticeList.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(filteredData);
        setNotices(filteredData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotices();
  }, []);

  const handleSignOut = async () => {
    try {
      // Call the signOut function from Firebase auth
      await signOut(auth); // Assuming `auth` is your Firebase auth instance
      // Redirect the user to the login page after sign-out
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <Button
        leftIcon={<PiSignOutBold />}
        colorScheme="white"
        variant="solid"
        size="lg"
        position="absolute"
        top="20%"
        right="10%"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
      <Box padding={{base: '40% 2% 2% 2%', md: '15% 5% 5% 5%', xl: '15% 5% 5% 5%'}}  backgroundColor="#213555">
        {/* <Heading as="h1" mb="4" color="#fff">
          Student Dashboard
        </Heading> */}
        <Heading as="h1" mb="4" color="#fff">
          Hi {studentDataFromLogin.name}
        </Heading>

        {/* Three cards for different tasks */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="4" mt="3%">
          {/* Card 1: Task 1 */}
          <Link to="/studentDashboard/joinClubs" state={studentDataFromLogin}>
          <Box bg="gray.100" p="4" borderRadius="md">
            <Heading as="h2" fontSize="lg" mb="2">
              Join Clubs
            </Heading>
            <Text>Join exhilarating clubs !</Text>
          </Box>
          </Link>
          

          {/* Card 2: Task 2 */}
          <Link to="/studentDashboard/exploreAlumni" state={studentDataFromLogin}>
          <Box bg="gray.100" p="4" borderRadius="md">
            <Heading as="h2" fontSize="lg" mb="2">
              Find Alumni
            </Heading>
            <Text>Connect with Alumni</Text>
          </Box>
          </Link>
          

          {/* Card 3: Task 3 */}
          <Link to="/studentDashboard/lodgeGrievance" state={studentDataFromLogin}>
          <Box bg="gray.100" p="4" borderRadius="md">
            <Heading as="h2" fontSize="lg" mb="2">
              Lodge Grievance
            </Heading>
            <Text>Lodge Complaint to the Authority</Text>
          </Box>
          </Link>
          
        </SimpleGrid>

        {/* Notice board */}
        <Box
          mt="8"
          bg="gray.200"
          p="4"
          borderRadius="md"
          maxHeight="300px"
          overflowY="auto"
        >
          <Heading as="h2" fontSize="lg" mb="2">
            Notice Board
          </Heading>
          {notices &&
            notices.map((notification, index) => (
              <Box key={index} bg="white" p="3" mb="2" borderRadius="md">
                <Text fontSize="sm">{notification.detail}</Text>
                <Text fontSize="xs" color="gray.500">
                  {notification.date}
                </Text>
              </Box>
            ))}
        </Box>
      </Box>
    </>
  );
};

export default StudentDashboard;
