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


const StudentsPage = () =>{
    const [newStudents, setNewStudents] = useState([])
    const newStudentCollection = collection(db, "notApprovedStudents")
    const approvedStudentCollection = collection(db, "studentDetails")

    const fetchNewStudents = async () => {
        const result = await getDocuments(newStudentCollection);
        setNewStudents(result);
        console.log(newStudents);
      };
    
      useEffect(() => {
        fetchNewStudents();
      }, []);

    
    
      const handleApproveStudent = async (studentObject, id) => {
        const newStudentObject = {
          ...studentObject, 
          isApproved : true}

        await addDocument(approvedStudentCollection, newStudentObject)

        await handleDeleteFromFireStore("notApprovedStudents", id)

        fetchNewStudents()
      }


    return <>
    <Box 
    backgroundColor="#213555"
    paddingTop="30vh"
    minH="100vh"
    width="100%"
    position="relative"
    >
            <Heading size="md" mb="4">New Students Approval</Heading>

        <Flex
        flexDir="column"
        align="center"
        justify="center">

        
            {newStudents.map(student => {

            console.log(student.id)
            return (
              
                <Box
                alignContent="center"
                width="70%"
                backgroundColor="#fff" 
                borderWidth="1px" borderRadius="md" p="4" mb="4">
                    

                    
                <Flex
                flexDir='column'
                spacing="2">
                    <Text><strong>Name:</strong> {student.name}</Text>
                    <Text><strong>Email:</strong> {student.email}</Text>
                    <Text><strong>Admission Number:</strong> {student.admissionNo}</Text>
                    <Text><strong>Course:</strong> {student.course}</Text>
                    <Button onClick={()=> handleApproveStudent(student, student.id)}>
                        Approve
                    </Button>
                </Flex>
                
            </Box>
            
            )}
          )}
          </Flex>
           
        </Box>
    </>
}

export default StudentsPage




