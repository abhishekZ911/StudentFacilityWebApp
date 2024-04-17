import "./admin.css";
import AOS from "aos";
import { DeleteIcon } from "@chakra-ui/icons";
import { Link as RouterLink, Outlet } from "react-router-dom";

import {
  FaFileDownload,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarker,
} from "react-icons/fa";
import {
  Box,
  Card,
  GridItem,
  Grid,
  Flex,
  Text,
  Button,
  Input,
  Center,
  Image,
  Divider,
  Badge,
  Checkbox,
  Stack,
  VStack,
  HStack,
  Spacer,
  IconButton,
  Link,
  Heading,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  Firestore,
} from "firebase/firestore";
import { signOut, onAuthStateChanged, getAuth } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { db, storage } from "../config/firebase-config";
import { PiSignOutBold } from "react-icons/pi";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocuments } from "../../FireBaseUtils/firebaseFunction";

const AdminPanel = () => {
const auth = getAuth();

  const [newNews, setNewNews] = useState("");
  const [newNewsDate, setNewNewsDate] = useState();
  const [news, setNews] = useState("");
  const [newTopperImage, setNewTopperImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [newTopperName, setNewTopperName] = useState(null);
  const [newTopperResult, setNewTopperResult] = useState(undefined);

  const [newTopperImage12, setNewTopperImage12] = useState(null);
  const [imageList12, setImageList12] = useState([]);
  const [newTopperName12, setNewTopperName12] = useState(null);
  const [newTopperResult12, setNewTopperResult12] = useState(undefined);

  const [newJob, setNewJob] = useState({
    jobRole: "",
    place: "",
    description: "",
  });

  const onNewJobChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewJob({
      ...newJob,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const jobAdditionRef = collection(db, "newJobAddition");

  const handleNewJobAddition = async (e) => {
    e.preventDefault();

    try {
      await addDoc(jobAdditionRef, newJob);
      console.log("added job successfully");
      getAllJobRoles();
    } catch (err) {
      console.error(err);
    }
  };
  const [authUser, setAuthUser] = useState(null);

  const [isMobileResponsive, setIsMobileResponsive] = useState(
    window.innerWidth < 700 ? true : false
  );

  const [enquiryData, setEnquiryData] = useState([]);

  const [jobApplicationList, setJobApplicationList] = useState([]);

  const [allJobRoles, setAllJobRoles] = useState([]);
  const newsCollectionRef = collection(db, "news");
  const navigate = useNavigate();

  useEffect(() => {
    getNews();
    getImagesObject();
    getImagesObject12();
    getEnquiryData();
    getJobApplications();
    getAllJobRoles();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        navigate("/admin");
      } else {
        setAuthUser(null);
      }
    });
  }, []);

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 700
        ? setIsMobileResponsive(true)
        : setIsMobileResponsive(false);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getNews = async () => {
    try {
      const data = await getDocs(newsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNews(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const addNews = async () => {
    try {
      await addDoc(newsCollectionRef, { detail: newNews, date: newNewsDate });
      getNews();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNews = async (id) => {
    try {
      const newsDoc = doc(db, "news", id);
      await deleteDoc(newsDoc);
      getNews();
    } catch (err) {
      console.error(err);
    }
  };

  //Functions for New Topper Details Section

  const metadata = {
    contentType: "image/png",
  };

  const imageCollection = collection(db, "class10TopperImages");

  const getImagesObject = async () => {
    try {
      const data = await getDocs(imageCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
      }));
      setImageList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const jobApplicationCollection = collection(db, "newApplicantInfo");
  const allJobRolesCollection = collection(db, "newJobAddition");

  const getAllJobRoles = async () => {
    try {
      const data = await getDocs(allJobRolesCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAllJobRoles(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJobRole = async (id) => {
    try {
      const deleteJobDoc = doc(db, "newJobAddition", id);
      await deleteDoc(deleteJobDoc);
      getAllJobRoles();
    } catch (err) {
      console.error(err);
    }
  };

  const getJobApplications = async () => {
    try {
      const data = await getDocs(jobApplicationCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
      }));
      console.log(filteredData);
      setJobApplicationList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const imageCollection12 = collection(db, "class12TopperImages");
  const getImagesObject12 = async () => {
    try {
      const data = await getDocs(imageCollection12);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
      }));
      setImageList12(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const addTopper = async () => {
    if (
      newTopperImage == null ||
      newTopperName == null ||
      newTopperResult == null
    ) {
      alert("Please fill all the details");
      return;
    }
    const uniqueImageId = v4();
    const firestoreTopRef = doc(db, "class10TopperImages", uniqueImageId);
    const imageRef = ref(storage, `class10/${uniqueImageId}`);

    try {
      await uploadBytes(imageRef, newTopperImage, metadata).then((snapshot) =>
        console.log("uploaded")
      );
      const imageUrl = await getDownloadURL(imageRef);

      await setDoc(firestoreTopRef, {
        name: newTopperName,
        result: newTopperResult,
        url: imageUrl,
        id: `${uniqueImageId}`,
      }).then(() => console.log("document added in firestore"));

      setNewTopperImage("");
      setNewTopperName("");
      setNewTopperResult("");
      alert("Details Updated");
      getImagesObject();
    } catch (err) {
      console.error(err);
    }
  };

  const addTopper12 = async () => {
    if (
      newTopperImage12 == null ||
      newTopperName12 == null ||
      newTopperResult12 == null
    ) {
      alert("Please fill all the details");
      return;
    }
    const uniqueImageId12 = v4();
    const firestoreTopRef12 = doc(db, "class12TopperImages", uniqueImageId12);
    const imageRef12 = ref(storage, `class12/${uniqueImageId12}`);

    try {
      await uploadBytes(imageRef12, newTopperImage12, metadata).then(
        (snapshot) => console.log("uploaded")
      );
      const imageUrl12 = await getDownloadURL(imageRef12);

      await setDoc(firestoreTopRef12, {
        name: newTopperName12,
        result: newTopperResult12,
        url: imageUrl12,
        id: `${uniqueImageId12}`,
      }).then(() => console.log("document added in firestore"));

      setNewTopperImage12("");
      setNewTopperName12("");
      setNewTopperResult12("");
      alert("Details Updated");
      getImagesObject12();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTopperFromFirestore = async (id) => {
    try {
      const deleteTopperDoc = doc(db, "class10TopperImages", id);
      await deleteDoc(deleteTopperDoc);
    } catch (err) {
      console.error(err);
    }
  };
  const deleteTopper = async (id) => {
    const deleteRef = ref(storage, `class10/${id}`);
    console.log(id);

    deleteObject(deleteRef)
      .then(() => {
        alert("file deleted successfully");
        deleteTopperFromFirestore(id);
        getImagesObject();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteTopperFromFirestore12 = async (id) => {
    try {
      const deleteTopperDoc12 = doc(db, "class12TopperImages", id);
      await deleteDoc(deleteTopperDoc12);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTopper12 = async (id) => {
    const deleteRef12 = ref(storage, `class12/${id}`);
    console.log(id);

    deleteObject(deleteRef12)
      .then(() => {
        alert("file deleted successfully");
        deleteTopperFromFirestore12(id);
        getImagesObject12();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const enquiryCollection = collection(db, "enquiryData");

  const getEnquiryData = async () => {
    try {
      const data = await getDocs(enquiryCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(filteredData);
      setEnquiryData(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnquiryDelete = async (id) => {
    try {
      const deleteEnquiryDoc = doc(db, "enquiryData", id);
      await deleteDoc(deleteEnquiryDoc);
    } catch (err) {
      console.error(err);
    }

    getEnquiryData();
  };

  const handleSignOut = async () => {
    signOut(auth)
      .then(() => {
        alert("Signed Out");
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDeleteJobApplication = async (id) => {
    try {
      const deleteJobEnquiryDoc = doc(db, "newApplicantInfo", id);
      await deleteDoc(deleteJobEnquiryDoc);
      getJobApplications();
    } catch (err) {
      console.error(err);
    }
  };

  ;

  // Function to fetch new student data from Firestore
  

  return (
    <>
      {" "}
      {authUser != null ? (
        <VStack spacing={6} w="100vw">
          <Box
            w={`${isMobileResponsive ? "100vw" : "100%"}`}
            backgroundColor="#213555"
            position="relative"
            boxShadow="md"
          >
            <Center>
              <Box
                maxW="1100px"
                backgroundColor="#213555"
                position="relative"
                mt="17vh"
              >
                <Center position="relative">
                  <Text color="white" fontSize="4xl" as="b" pb="5vh">
                    Welcome Admin !
                  </Text>
                  <HStack
                    spacing={2}
                    alignItems="center"
                    position="absolute"
                    right="30px"
                  >
                    <Button
                      leftIcon={<PiSignOutBold />}
                      colorScheme="white"
                      variant="solid"
                      size="lg"
                      onClick={handleSignOut}
                      mt={`${isMobileResponsive ? "70px" : ""}`}
                      bottom={`${isMobileResponsive ? "10px" : ""}`}
                    >
                      Sign Out
                    </Button>
                  </HStack>
                </Center>

                <Flex justifyContent="space-between">
                  <RouterLink to="/admin/newstudents">
                  <Box
                    
                    maxW="sm"
                    borderWidth="1px"
                    backgroundColor="#fff"
                    borderRadius="lg"
                    p="4"
                    m="2"
                  >
                    <Flex alignItems="center" mb="2">
                      <FaUser size={20} />
                      <Text ml="2">New Students</Text>
                    </Flex>
                    Approve the new comers !
                  </Box>
                  </RouterLink>
                  
                  
                  <Box
                    maxW="sm"
                    borderWidth="1px"
                    backgroundColor="#fff"
                    borderRadius="lg"
                    p="4"
                    m="2"
                  >
                    <Flex alignItems="center" mb="2">
                      <FaEnvelope size={20} />
                      <Text ml="2">Email</Text>
                    </Flex>
                    {/* Add content here */}
                  </Box>
                  <Box
                    maxW="sm"
                    borderWidth="1px"
                    backgroundColor="#fff"
                    borderRadius="lg"
                    p="4"
                    m="2"
                  >
                    <Flex alignItems="center" mb="2">
                      <FaPhone size={20} />
                      <Text ml="2">Phone</Text>
                    </Flex>
                    {/* Add content here */}
                  </Box>
                  <Box
                    maxW="sm"
                    borderWidth="1px"
                    backgroundColor="#fff"
                    borderRadius="lg"
                    p="4"
                    m="2"
                  >
                    <Flex alignItems="center" mb="2">
                      <FaMapMarker size={20} />
                      <Text ml="2">Location</Text>
                    </Flex>
                    {/* Add content here */}
                  </Box>
                </Flex>

                <VStack spacing={6} p={6}>
                  <Box
                    m="2"
                    position="relative"
                    borderRadius="15px"
                    mr="3"
                    data-aos="fade-zoom-in"
                    data-aos-easing="ease-in-back"
                    data-aos-delay="250"
                    data-aos-offset="0"
                  >
                    <Flex
                      flexDirection={`${isMobileResponsive ? "column" : "row"}`}
                      align="flex-start"
                      justify="space-between"
                      position="relative"
                      w="100%"
                    >
                      <Box
                        borderRadius="15px"
                        w={`${isMobileResponsive ? "100%" : "35%"}`}
                        backgroundColor="#F5F5F5"
                        p="5"
                        boxShadow="dark-lg"
                      >
                        <Text>Create News Item</Text>
                        <Box>
                          <Input
                            backgroundColor="#D8D9DA"
                            m="1"
                            p="1"
                            onChange={(e) => setNewNews(e.target.value)}
                            placeholder="Enter news..."
                          />
                          <Input
                            m="1"
                            p="1"
                            onChange={(e) => setNewNewsDate(e.target.value)}
                            type="date"
                          />
                        </Box>
                        <Button
                          backgroundColor={"blue.300"}
                          onClick={() => addNews()}
                        >
                          Add
                        </Button>
                      </Box>
                      <Box
                        borderRadius="15px"
                        backgroundColor="#F5F5F5"
                        w="100%"
                        ml={`${isMobileResponsive ? "" : "5"}`}
                        mt={`${isMobileResponsive ? "5" : ""}`}
                        p="5"
                      >
                        News
                        <Flex className="scrollable-div" flexDir="column">
                          {news &&
                            news.map((data) => (
                              <>
                                <Box
                                  backgroundColor="#D8D9DA"
                                  width="100%"
                                  display="flex"
                                  justify="space-between"
                                  flexDirection="row"
                                  id={data.id}
                                  p="3"
                                >
                                  <Box w="80%" className="detail">
                                    <Box fontSize={"md"}>{data.detail}</Box>
                                    <Box fontSize="sm">{data.date}</Box>
                                  </Box>
                                  <Button
                                    w="20%"
                                    m="1"
                                    onClick={(e) => deleteNews(data.id)}
                                  >
                                    Delete
                                  </Button>
                                </Box>
                              </>
                            ))}
                        </Flex>
                      </Box>
                    </Flex>
                  </Box>
                </VStack>

                <VStack spacing={6} p={6}>
                  <Heading
                    as="h1"
                    fontSize="3xl"
                    color="white"
                    textAlign="center"
                    mt="10vh"
                    mb="5vh"
                  >
                    Form Submissions
                  </Heading>
                  <Box
                    borderRadius="15px"
                    backgroundColor="#F5F5F5"
                    mt="5vh"
                    p="5"
                    minH="200px"
                    maxH="400px"
                    m="5"
                    overflowY={"auto"}
                    w={`${isMobileResponsive ? "90vw" : "80%"}`}
                    data-aos="fade-zoom-in"
                    data-aos-easing="ease-in-back"
                    data-aos-delay="250"
                    data-aos-offset="0"
                  >
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
                      {enquiryData.length !== 0 ? (
                        enquiryData.map((data) => (
                          <Box
                            key={data.id}
                            borderWidth="1px"
                            borderRadius="lg"
                            p={4}
                            boxShadow="md"
                            bg="white"
                            transition="transform 0.2s"
                            _hover={{ transform: "scale(1.02)" }}
                          >
                            <Text fontSize="xl" fontWeight="bold">
                              {data.name}
                            </Text>
                            <Badge
                              colorScheme={data.option1 ? "green" : "red"}
                              mt={2}
                            >
                              {data.option1 ? "Admission" : "Job"}
                            </Badge>
                            <Text fontSize="md" mt={2}>
                              Age: {data.age}
                            </Text>
                            <Text fontSize="md">Purpose: {data.purpose}</Text>
                            <Text fontSize="md">
                              Phone Number: {data.phoneNumber}
                            </Text>
                            <Text fontSize="md">Email ID: {data.email}</Text>
                            <HStack mt={4}>
                              <Spacer />
                              <IconButton
                                aria-label="Delete"
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                size="sm"
                                onClick={(e) => handleEnquiryDelete(data.id)}
                              />
                            </HStack>
                          </Box>
                        ))
                      ) : (
                        <Box
                          h="100px"
                          display="flex"
                          align="center"
                          justify="center"
                        >
                          <Text as="b" fontsize="2xl" color="black">
                            No Enquires !
                          </Text>
                        </Box>
                      )}
                    </SimpleGrid>
                  </Box>
                </VStack>

                <VStack spacing={6} p={6}>
                  <Flex align="center" justify="center">
                    <Text fontSize="3xl" color="white" as="b">
                      Job Enquiries
                    </Text>
                  </Flex>

                  <Box
                    borderRadius="15px"
                    backgroundColor="#F5F5F5"
                    mt="5vh"
                    p="5"
                    minH="200px"
                    maxH="400px"
                    m="4"
                    w={`${isMobileResponsive ? "90vw" : "60%"}`}
                    overflowY={"auto"}
                    data-aos="fade-zoom-in"
                    data-aos-easing="ease-in-back"
                    data-aos-delay="200"
                    data-aos-offset="0"
                  >
                    <Text pb="4">Create New Job</Text>
                    <VStack>
                      <Input
                        placeholder="Enter Job Role"
                        type="text"
                        name="jobRole"
                        value={newJob.jobRole}
                        onChange={onNewJobChange}
                      ></Input>
                      <Stack spacing={5} direction="row">
                        <Checkbox
                          name="remote"
                          isChecked={newJob.isRemoteChecked}
                          onChange={onNewJobChange}
                        >
                          Remote
                        </Checkbox>
                        <Checkbox
                          name="onSite"
                          isChecked={newJob.isOnsiteChecked}
                          onChange={onNewJobChange}
                        >
                          On-site
                        </Checkbox>
                      </Stack>
                      <Input
                        name="description"
                        value={newJob.description}
                        onChange={onNewJobChange}
                        type="text"
                        placeholder="Description"
                      ></Input>
                    </VStack>
                    <Button
                      float="right"
                      mt="4"
                      position="relative"
                      backgroundColor={"blue.300"}
                      onClick={handleNewJobAddition}
                    >
                      Submit
                    </Button>
                  </Box>

                  <Text fontSize={"2xl"} as="b" color="white">
                    All Job Roles
                  </Text>
                  <Box
                    borderRadius="15px"
                    backgroundColor="#F5F5F5"
                    mt="5vh"
                    p="5"
                    minH="200px"
                    maxH="420px"
                    m="5"
                    w={`${isMobileResponsive ? "90vw" : "60%"}`}
                    overflowY={"auto"}
                    data-aos="fade-zoom-in"
                    data-aos-easing="ease-in-back"
                    data-aos-delay="200"
                    data-aos-offset="0"
                  >
                    {allJobRoles.length !== null ? (
                      allJobRoles.map((job) => (
                        <Center>
                          <Box
                            borderWidth="1px"
                            borderRadius="md"
                            p="4"
                            shadow="md"
                            mb="4"
                            backgroundColor="white"
                            w={`${isMobileResponsive ? "" : "60%"}`}
                          >
                            <Flex
                              position="relative"
                              flexDir={`${
                                isMobileResponsive ? "column" : "row"
                              }`}
                            >
                              <Box w={`${isMobileResponsive ? "90%" : "33%"}`}>
                                <Text fontSize="xl" fontWeight="bold" mb="2">
                                  Job Role : {job.jobRole}
                                </Text>
                              </Box>

                              <Box w={`${isMobileResponsive ? "90%" : "33%"}`}>
                                <Text fontSize="md" color="gray.600" mb="2">
                                  Job Description : {job.description}
                                </Text>
                                <Text fontSize="md" color="gray.600" mb="2">
                                  {job.place !== null && job.place}
                                  {job.remote == true && "Remote"}
                                </Text>
                              </Box>
                            </Flex>
                            <Flex justify="space-between">
                              <IconButton
                                aria-label="Delete"
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                size="sm"
                                label="delete"
                                position="relative"
                                right="0px"
                                onClick={() => handleDeleteJobRole(job.id)}
                              />
                            </Flex>
                            <Divider mt="4" />
                          </Box>
                        </Center>
                      ))
                    ) : (
                      <Flex>
                        <Text color="white" as="b">
                          No Job Roles
                        </Text>
                      </Flex>
                    )}
                  </Box>
                  <Text as="b" fontSize="2xl" color="white">
                    Job Applications
                  </Text>
                  <Box
                    borderRadius="15px"
                    backgroundColor="#F5F5F5"
                    mt="5vh"
                    p="5"
                    minH="200px"
                    maxH="420px"
                    m="5"
                    w={`${isMobileResponsive ? "90vw" : "60%"}`}
                    overflowY={"auto"}
                    data-aos="fade-zoom-in"
                    data-aos-easing="ease-in-back"
                    data-aos-delay="200"
                    data-aos-offset="0"
                  >
                    {jobApplicationList.length !== 0 ? (
                      jobApplicationList.map((item) => (
                        <Center>
                          <Box
                            borderWidth="1px"
                            borderRadius="md"
                            p="4"
                            shadow="md"
                            mb="4"
                            backgroundColor="white"
                            w={`${isMobileResponsive ? "" : "60%"}`}
                          >
                            <Flex
                              position="relative"
                              flexDir={`${
                                isMobileResponsive ? "column" : "row"
                              }`}
                            >
                              <Box w={`${isMobileResponsive ? "90%" : "33%"}`}>
                                <Text fontSize="xl" fontWeight="bold" mb="2">
                                  {item.name}
                                </Text>
                                <Badge
                                  colorScheme={item.yes ? "green" : "red"}
                                  mb="2"
                                >
                                  Can Join :
                                  <br />
                                  {item.yes ? "Immediately" : "Not Immediately"}
                                </Badge>
                              </Box>

                              <Box w={`${isMobileResponsive ? "90%" : "33%"}`}>
                                <Text fontSize="md" color="gray.600" mb="2">
                                  For job: {item.job}
                                </Text>
                                <Text fontSize="md" color="gray.600" mb="2">
                                  Email: {item.email}
                                </Text>
                              </Box>
                              <Box w={`${isMobileResponsive ? "90%" : "33%"}`}>
                                <Text fontSize="md" color="gray.600" mb="2">
                                  Age: {item.age}
                                </Text>
                                <Text fontSize="md" color="gray.600" mb="2">
                                  Phone Number: {item.phoneNumber}
                                </Text>
                              </Box>
                            </Flex>
                            <Flex justify="space-between">
                              <Button
                                leftIcon={<Icon as={FaFileDownload} />}
                                colorScheme="blue"
                                variant="outline"
                              >
                                <Link
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Download Resume
                                </Link>
                              </Button>
                              <IconButton
                                aria-label="Delete"
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                size="sm"
                                label="delete"
                                position="relative"
                                right="0px"
                                onClick={() =>
                                  handleDeleteJobApplication(item.id)
                                }
                              />
                            </Flex>
                            <Divider mt="4" />
                          </Box>
                        </Center>
                      ))
                    ) : (
                      <Flex align="center" justify="center">
                        <Text color="black" as="b" fontSize="2xl">
                          No enquiries
                        </Text>
                      </Flex>
                    )}
                  </Box>
                </VStack>

                <VStack spacing="6" p="6">
                  <Box
                    m="2"
                    position="relative"
                    borderRadius="15px"
                    mr="3"
                    mt="15vh"
                  >
                    <Center mb="3">
                      <Text color="white" p="6" fontSize="3xl" as="b" mb="5vh">
                        Topper Details Update Section
                        <br />
                      </Text>
                    </Center>
                    <Center></Center>
                    <Center mb="5">
                      <Text as="b" color="white" fontSize="2xl">
                        Class 10th
                      </Text>
                    </Center>
                  </Box>
                </VStack>
                <VStack spacing={6} p={6}>
                  <Flex
                    flexDirection={`${isMobileResponsive ? "column" : "row"}`}
                    align="flex-start"
                    justify="space-between"
                    position="relative"
                    data-aos="fade-zoom-in"
                    data-aos-easing="ease-in-back"
                    data-aos-delay="200"
                    data-aos-offset="0"
                  >
                    <Box
                      borderRadius="15px"
                      w={`${isMobileResponsive ? "100%" : "35%"}`}
                      backgroundColor="#F5F5F5"
                      p="5"
                      boxShadow="lg"
                    >
                      <Text>Add New Topper Details</Text>
                      <Box>
                        <Input
                          backgroundColor="#D8D9DA"
                          type="file"
                          m="1"
                          p="1"
                          onChange={(e) => {
                            setNewTopperImage(e.target.files[0]);
                          }}
                        />
                        <Input
                          m="1"
                          p="1"
                          placeholder="Enter name..."
                          onChange={(e) => setNewTopperName(e.target.value)}
                          value={newTopperName}
                          type="text"
                        />
                        <Input
                          m="1"
                          p="1"
                          type="number"
                          placeholder="Enter percentage..."
                          value={newTopperResult}
                          onChange={(e) => setNewTopperResult(e.target.value)}
                        ></Input>
                      </Box>
                      <Button
                        backgroundColor={"blue.300"}
                        onClick={() => addTopper()}
                      >
                        Add
                      </Button>
                    </Box>
                    <Box
                      borderRadius="15px"
                      backgroundColor="#F5F5F5"
                      w="100%"
                      p="5"
                      fontSize="xl"
                      as="b"
                      ml={`${isMobileResponsive ? "" : "5"}`}
                      mt={`${isMobileResponsive ? "5" : ""}`}
                    >
                      Toppers
                      <Grid
                        className="scrollable-div"
                        templateColumns={"repeat(5, 1fr)"}
                        gap="2"
                      >
                        {imageList.length !== 0 ? (
                          imageList.map((image) => (
                            <GridItem
                              key={image.id}
                              colSpan={1}
                              h="180px"
                              maxh="200px"
                            >
                              <Card variant="elevated">
                                <Image src={image.url}>
                                  {console.log(image.url)}
                                </Image>
                                <Box textAlign="center" position="relative">
                                  <Text>{image.name}</Text>
                                  <Text>{image.result}</Text>
                                </Box>
                                <Button
                                  m="3"
                                  key={image.id}
                                  onClick={(e) => deleteTopper(image.id)}
                                >
                                  Delete
                                </Button>
                              </Card>
                            </GridItem>
                          ))
                        ) : (
                          <Flex w="100%" justify="center" align="center">
                            <Text fontSize="2xl">Oops...Nothing's Here</Text>
                          </Flex>
                        )}
                      </Grid>
                    </Box>
                  </Flex>
                </VStack>

                <VStack spacing={6} p={6}>
                  <Box
                    m="2"
                    position="relative"
                    borderRadius="15px"
                    mr="3"
                    mt="10vh"
                  >
                    <Center mb="5">
                      <Text as="b" color="white" fontSize="xl">
                        Class 12th
                      </Text>
                    </Center>
                    <Flex
                      flexDirection={`${isMobileResponsive ? "column" : "row"}`}
                      align="flex-start"
                      justify="space-between"
                      position="relative"
                      data-aos="fade-zoom-in"
                      data-aos-easing="ease-in-back"
                      data-aos-delay="200"
                      data-aos-offset="0"
                    >
                      <Box
                        borderRadius="15px"
                        w={`${isMobileResponsive ? "100vw" : "35%"}`}
                        backgroundColor="#F5F5F5"
                        p="5"
                        boxShadow="lg"
                      >
                        <Text>Add New Topper Details</Text>
                        <Box>
                          <Input
                            backgroundColor="#D8D9DA"
                            type="file"
                            m="1"
                            p="1"
                            onChange={(e) => {
                              setNewTopperImage12(e.target.files[0]);
                            }}
                          />
                          <Input
                            m="1"
                            p="1"
                            placeholder="Enter name..."
                            onChange={(e) => setNewTopperName12(e.target.value)}
                            value={newTopperName12}
                            type="text"
                          />
                          <Input
                            m="1"
                            p="1"
                            type="number"
                            placeholder="Enter percentage..."
                            value={newTopperResult12}
                            onChange={(e) =>
                              setNewTopperResult12(e.target.value)
                            }
                          ></Input>
                        </Box>
                        <Button
                          backgroundColor={"blue.300"}
                          onClick={() => addTopper12()}
                        >
                          Add
                        </Button>
                      </Box>
                      <Box
                        borderRadius="15px"
                        backgroundColor="#F5F5F5"
                        w="100%"
                        p="5"
                        fontSize="xl"
                        as="b"
                        ml={`${isMobileResponsive ? "" : "5"}`}
                        mt={`${isMobileResponsive ? "5" : ""}`}
                      >
                        Toppers
                        <Grid
                          className="scrollable-div"
                          templateColumns={"repeat(5, 1fr)"}
                          gap="2"
                        >
                          {imageList12.length !== 0 ? (
                            imageList12.map((image) => (
                              <GridItem
                                key={image.id}
                                colSpan={1}
                                h="180px"
                                maxh="200px"
                              >
                                <Card variant="elevated">
                                  <Image src={image.url}>
                                    {console.log(image.url)}
                                  </Image>
                                  <Box textAlign="center" position="relative">
                                    <Text>{image.name}</Text>
                                    <Text>{image.result}</Text>
                                  </Box>
                                  <Button
                                    m="3"
                                    key={image.id}
                                    onClick={(e) => deleteTopper12(image.id)}
                                  >
                                    Delete
                                  </Button>
                                </Card>
                              </GridItem>
                            ))
                          ) : (
                            <Flex w="100vw" justify="center" align="center">
                              <Text fontSize="2xl">Oops...Nothing's Here</Text>
                            </Flex>
                          )}
                        </Grid>
                      </Box>
                    </Flex>
                  </Box>
                </VStack>
              </Box>
            </Center>
          </Box>
        </VStack>
      ) : (
        <Flex h="100vh" align="center" justify="center">
          <Text as="b" fontSize="2xl">
            Loading...
            <Navigate to="/login"></Navigate>
          </Text>
        </Flex>
      )}
    </>
  );
};

export default AdminPanel;
