import { Box, Heading, Text, Divider,Center, HStack, Checkbox, Stack, Button, Flex, Container } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { addDocument, getDocuments, handleDeleteFromFireStore } from '../../FireBaseUtils/firebaseFunction';
import {
    getDocs,
    collection,
    addDoc,
    deleteDoc,
    doc,
    setDoc,
    Firestore,
  } from "firebase/firestore";
  import { db } from '../config/firebase-config';


const ApproveAlumni = () =>{
    const [newAlumni , setNewAlumni] = useState([])
    const newAlumniCollection = collection(db, "notApprovedAlumni")
    const approvedAlumniCollection = collection(db, "alumniDetails")

    const fetchNewAlumni = async () => {
        const result = await getDocuments(newAlumniCollection);
        setNewAlumni(result);
        console.log(newAlumni);
      };
    
      useEffect(() => {
        fetchNewAlumni();
      }, []);

    
    
      const handleApproveAlumni = async (AlumniObject, id) => {
        const newAlumniObject = {
          ...AlumniObject, 
          isApproved : true}

        await addDocument(approvedAlumniCollection, newAlumniObject)

        await handleDeleteFromFireStore("notApprovedAlumnis", id)

        fetchNewAlumni()
      }

      const handleDismiss = async (id) =>{
        await handleDeleteFromFireStore("notApprovedAlumni", id)
        fetchNewAlumni()
      }


    return <>
    <Box 
    backgroundColor="#213555"
    paddingTop="30vh"
    minH="100vh"
    width="100%"
    position="relative"
    >
            <Heading size="md" mb="4">New Alumnis Approval</Heading>

        <Flex
        flexDir="column"
        align="center"
        justify="center">

        
            {newAlumni.map(Alumni => {

            console.log(Alumni.id)
            return (
              
                <Box
                alignContent="center"
                width="70%"
                backgroundColor="#fff" 
                borderWidth="1px" borderRadius="md" p="4" mb="4">
                    

                    
                <Flex
                flexDir='column'
                spacing="2">
                    <Text><strong>Name:</strong> {Alumni.name}</Text>
                    <Text><strong>Email:</strong> {Alumni.email}</Text>
                    <Text><strong>Admission Number:</strong> {Alumni.admissionNo}</Text>
                    <Text><strong>Course:</strong> {Alumni.course}</Text>
                    <Button onClick={()=> handleApproveAlumni(Alumni, Alumni.id)}>
                        Approve
                    </Button>
                    <Button colorScheme="red" size="sm" onClick={() => handleDismiss(Alumni.id)}>
                    Dismiss
                    </Button>
                </Flex>
                
            </Box>
            
            )}
          )}
          </Flex>
           
        </Box>
    </>
}

export default ApproveAlumni;




