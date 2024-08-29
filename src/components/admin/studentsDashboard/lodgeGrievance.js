import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  Center
} from "@chakra-ui/react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { Navigate, useLoaderData, useLocation, useNavigate } from "react-router-dom";

const GrievanceLodging = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [complaintDetail, setComplaintDetail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state;

  useEffect(()=>{
    if(!data ||
        !data.identity ||
        data.identity !== "student"){
            navigate("/login")
            return;
        }
  })

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const grievanceData = {
        name: data.name,
        email: data.email,
        title,
        complaintDetail,
      };
      await addDoc(collection(db, "grievances"), grievanceData);
      // Reset form fields
      setName("");
      setTitle("");
      setComplaintDetail("");
    } catch (error) {
      console.error("Error lodging grievance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p="4" w="100%" margin="auto" 
    padding={{base: '40% 2% 2% 2%', md: '15% 5% 5% 5%', xl: '15% 5% 5% 5%'}}  backgroundColor="#213555">
        <Center>
        <Heading color="#fff" as="h1" mb="4">Lodge Grievance</Heading>

        </Center>
      <Center>
      <Box w="70%" backgroundColor="#fff" borderRadius="md" p="4">
      
      <Input
        placeholder="Complaint Title"
        mb="4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Complaint Detail"
        mb="4"
        value={complaintDetail}
        onChange={(e) => setComplaintDetail(e.target.value)}
      />
      <Button
        colorScheme="blue"
        isLoading={isLoading}
        loadingText="Submitting"
        onClick={handleSubmit}
      >
        Submit
      </Button>
      </Box>
      </Center>
      
    </Box>
  );
};

export default GrievanceLodging;
