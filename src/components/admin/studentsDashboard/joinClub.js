import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Heading, Text, Center } from '@chakra-ui/react';
import { getDocuments } from '../../../FireBaseUtils/firebaseFunction';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase-config';
import { useLocation, useNavigate } from 'react-router-dom';

const ClubsList = () => {
    const [clubsList, setClubsList] = useState([]);

    const location = useLocation()
    const navigate = useNavigate();
    const data = location.state
console.log(data)
    useEffect(() => {

        if (
            !data ||
            !data.identity ||
            data.identity !== "student"
          ) {
            navigate("/login");
            return;
          }

        const fetchClubsList = async () => {
            try {
                const clubs = await getDocuments(collection(db, "clubs"));
                setClubsList(clubs);
            } catch (error) {
                console.error("Error fetching clubs list:", error);
            }
        };
        fetchClubsList();
    }, []);


    const handleJoinGroup = async (club) => {
         const clubDocRef = doc(db, "clubs", club.id)
         const studentMembersCollection = collection(clubDocRef, 'members')

         const docRefOfDeletion = doc(studentMembersCollection, )

        //  try{
        //     await setDoc()
        //  }
    }

    return (
        <Flex flexDir="column" paddingTop="14%" backgroundColor="#213555">
            <Center>
            <Text fontSize="3xl" as="b" color={'white'}>Join Clubs</Text>

            </Center>
        <Flex justify="center" >
            
            <Box width="65%" p="4">
                <Heading as="h2" fontSize="2xl" mb="4" color="#fff">Clubs</Heading>
                {clubsList.map((club, index) => (
                    <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" mb="4">
                        <Box p="4">
                            <Heading as="h3" size="md" mb="2" color="blue.600">{club.clubName}</Heading>
                            <Text color="gray.600">{club.clubDescription}</Text>
                        </Box>
                        <Flex justify="flex-end" p="4">
                            <Button colorScheme="blue" onClick={handleJoinGroup(club)}>Join Club</Button>
                        </Flex>
                    </Box>
                ))}
            </Box>
        </Flex>
        </Flex>
    );
}

export default ClubsList;
