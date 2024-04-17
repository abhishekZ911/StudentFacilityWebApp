import { useState, useEffect } from "react";
import { db } from "./config/firebase-config";
import { storage } from "./config/firebase-config";
import { setDoc, doc, getDocs, collection } from 'firebase/firestore';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { v4 } from "uuid";
import AOS from "aos";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Divider,
  Modal,
  Flex,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Stack,
  Checkbox
} from "@chakra-ui/react";

const Careers = () => {

  const [jobList, setJobList] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        phoneNumber: "",
        joinImmediately: "",
        email: "",
    });

    useEffect(() => {
      AOS.init();
      getJobs();
    }, [])

    const [newApplicantResume, setNewApplicantResume] = useState(null);

    const handleInputChange = (e) =>{
        const {name, value, type, checked } = e.target;
        setFormData(
            {
                ...formData,
                [name]: type==="checkbox" ? checked : value
            }
        );
    }

    const jobApplicationRef = collection(db, "newJobAddition");

    const getJobs = async () =>{

      try{
        const data = await getDocs(jobApplicationRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(filteredData);
        setJobList(filteredData);

      }catch(err){
        console.error(err);
      }
    }
    


  const [selectedJob, setSelectedJob] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (job) => {
    setSelectedJob(job);
    console.log(job)
    setIsModalOpen(true);
  };


  const closeModal = () =>{
    setIsModalOpen(false);
    setFormData({
      name: "",
      age: "",
      phoneNumber: "",
      joinImmediately: "",
      email: "",
  });
  setSelectedJob(null);

  }
  const SubmitModal = async (e) => {
    

    const uniqueApplicantId = v4();
    const resumeRef = ref(storage, `applicantResume/${uniqueApplicantId}`);
    const newApplicantFirestoreRef = doc(db, "newApplicantInfo", uniqueApplicantId);

    try{
        await uploadBytes(resumeRef, newApplicantResume)
        .then((snapshot) => console.log('uploaded'));

        const resumeDownloadUrl = await getDownloadURL(resumeRef);

        await setDoc(newApplicantFirestoreRef, 
            {...formData,
                id: `${uniqueApplicantId}`,
                job: selectedJob.jobRole,
                url: resumeDownloadUrl,
            }).then(() => alert("Application Submitted Successfully"))
            
    }catch(err){
        console.error(err);
    }

    setSelectedJob(null);
    setIsModalOpen(false);
    setFormData({
        name: "",
        age: "",
        phoneNumber: "",
        joinImmediately: "",
        email: "",
    });
  };

  return (
    <Box
      w='100%'
      h='90vh'

      py={8}
      px={4}
      backgroundColor='#213555'
    >
      <Heading fontSize="2xl" textAlign="center" mb={6} mt={'15vh'} color='white'>
        Careers at ABC Public School
      </Heading>
      <VStack spacing={4} align="start" 
      mt='4'
      maxW="1100px"
      mx="auto">

        {(jobList.length !== 0) ? jobList.map((job) => (
          <Box
            key={job.id}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            w='50%'
            backgroundColor='white'
            boxShadow="2xl"
            data-aos='fade-left'
          >
            <Text fontWeight="bold">{job.jobRole}</Text>
            <Text fontSize="sm" color="gray.500">
              {job.remote && "Remote"}
              {job.onSite && "On-site"}
            </Text>
            <Divider my={2} />
            <Text>{job.description}</Text>
            <Button
              mt={4}
              colorScheme="blue"
              size="sm"
              onClick={() => openModal(job)}
            >
              Apply Now
            </Button>
          </Box>
        ))
      : 
      <Flex align='center' justify='center' w='100%' h='50vh'>
        <Text as='b' fontSize='xl' color='white'>No Job Roles Currently !</Text>
      </Flex> }
      </VStack>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Apply for {selectedJob?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
               type='text'
               name='name'
               value={formData.name}
               placeholder="Your name"
               onChange={handleInputChange}/>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Age</FormLabel>
              <Input 
              name='age'
              value={formData.age}
              type="number" placeholder="Your age" 
              onChange={handleInputChange}/>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Phone Number</FormLabel>
              <Input
              name='phoneNumber' 
              value={formData.phoneNumber} 
              type="tel" 
              placeholder="Your phone number" 
              onChange={handleInputChange}/>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Can You Join Immediately?</FormLabel>
              <Stack direction='row' spacing={4}>
                <Checkbox 
                name='yes'
                isChecked={formData.option1}
                onChange={handleInputChange}>
                    Yes
                </Checkbox>
              </Stack>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input 
              name='email'
              value={formData.email}
              type="email" placeholder="Your email"
              onChange={handleInputChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Upload Resume</FormLabel>
              <Input 
              type="file"
              files={newApplicantResume}
              onChange={(e) => setNewApplicantResume(e.target.files[0])} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={SubmitModal} colorScheme="blue" mr={3}>
              Submit
            </Button>
            <Button onClick={closeModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Careers;
