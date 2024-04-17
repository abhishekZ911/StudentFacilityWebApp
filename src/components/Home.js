import Carousel from "nuka-carousel";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { db } from "./config/firebase-config";
import { ReactComponent as Wave } from "./wave.svg";
import {
  Box,
  Text,
  Flex,
  Divider,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Center,
  FormControl,
  Image,
  Checkbox,
  Stack,
  Button,
  FormLabel,
  Input,
  Grid,

} from "@chakra-ui/react";
import "./Home.css";
import { Carousel as Carousel2 } from "react-configurable-carousel";
import { ReactComponent as BrushStroke } from "./hhh.svg";
import { ReactComponent as School } from "./school.svg";
import { ReactComponent as News } from "./news.svg";
import { ReactComponent as Greenwave } from "./greenwave.svg";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  const [isMobileResponsive, setIsMobileResponsive] = useState(
    window.innerWidth < 700 ? true : false
  );
  const images = [
    "https://via.placeholder.com/400x300",
    "https://via.placeholder.com/300x400",
    "https://via.placeholder.com/500x500",
    "https://via.placeholder.com/200x300",
    "https://via.placeholder.com/300x200",
  ];
  const [news, setNews] = useState([]);
  const [toppersList, setToppersList] = useState([]);
  const [toppersList12, setToppersList12] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    admission: false,
    job: false,
    age: "",
    purpose: "",
    phoneNumber: "",
    email: "",
  });

  const newsCollectionRef = collection(db, "news");

  const getNewsList = async () => {
    try {
      const data = await getDocs(newsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(filteredData);
      setNews(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getNewsList();
  }, []);

  const mappedNews = news.map((item) => {
    return (
      <div key={item.id}>
        <Text as="b" fontSize={"lg"}>
          {item.detail}
        </Text>
        <Text fontSize={"sm"}>{item.date}</Text>
        <Divider height="2px" borderColor="black" />
      </div>
    );
  });

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
  }, [window.innerWidth]);

  const toppersCollectionRef = collection(db, "class10TopperImages");
  const toppersCollectionRef12 = collection(db, "class12TopperImages");

  const getToppersList = async (toppers10Collection) => {
    try {
      const data = await getDocs(toppers10Collection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(filteredData);
      setToppersList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const getToppersList12 = async (toppers12Collection) => {
    try {
      const data = await getDocs(toppers12Collection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(filteredData);
      setToppersList12(filteredData);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getToppersList(toppersCollectionRef);
    getToppersList12(toppersCollectionRef12);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const enquiryCollectionRef = collection(db, "enquiryData");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can handle form submission logic here
    try {
      await addDoc(enquiryCollectionRef, formData);
    } catch (err) {
      console.error(err);
    }

    setFormData({
      name: "",
      admission: false,
      job: false,
      age: "",
      purpose: "",
      phoneNumber: "",
      email: "",
    });
  };

  return (
    <>
      <Flex flexDir='column' 
      align='center' 
      className="home-section" 
      w='100%'>
        <div className="carousel-div">
          <Box w='100%'>
          <Carousel
            autoplay
            autoplayInterval={4000}
            loop
            disableEdgeSwiping
            withoutControls
            wrapAround="true"
          >
            <img
              className="carousel-image"
              src="/images/carousel1.jpg"
              alt=""
            />
            <img
              className="carousel-image"
              src="/images/carousel2.jpg"
              alt=""
            />
          </Carousel>
          </Box>

          <div data-aos="fade-up" data-aos-delay='200' className="school-name">
            <Box>
            <Text fontSize="5xl" color="#A2FF86" as="b">
               ABC Public School
            </Text>
            <br />
            <Text fontSize='2xl' color='white' as='b'>One of the best schools of Ranchi</Text>
            <br />
            <Text fontSize='2xl' color='white' as='b'>Ranked at 2nd position for education </Text>

            </Box>
          </div>

          <div className="svg-div">
            <Box className="svg-container">
              <Wave />
            </Box>
          </div>
        </div>
        <Flex mt="10vw" direction="column" align="center">

          <Flex
            className={`${isMobileResponsive ? "column-flex" : "row-flex"}`}
            p="10"
            w="100%"
            align="center"
            justify="space-around"
          >
           {!isMobileResponsive &&
           <>
            <Box
              data-aos="fade"
              className="brush-stroke"
              position="absolute"
              w="100%"
              zIndex="-1"
            >
              <BrushStroke />
            </Box>
             
            <Flex data-aos-delay="200" data-aos="fade-right">
            <Box maxW="500px" className="school-svg">
              <School />
            </Box>
          </Flex>
          
          </>}
            

            <Box maxW="600px" borderRadius="lg">
              <Text p="5" fontSize="4xl" fontWeight="bold">
                Best School in Ranchi
              </Text>

              <Text
                data-aos-delay="500"
                data-aos="fade-left"
                fontSize="xl"
                p="5"
              >
                For excellence both in classroom and beyond gift your child an
                opportunity to study in ABC School which
                is the best Boarding School in Giridih, Jharkhand. This well
                known English medium school in Jharkhand aims to train the
                students to be future ready and equipped. The students are
                exposed to experiential way of learning in order to keep them
                abreast with real world scenario. Saluja Gold International
                School, Giridih is a CBSE Board School in Jharkhand which
                provides the most outstanding hostel facility.
              </Text>
            </Box>
          </Flex>
        </Flex>
        <Flex mt="15vw" mb="10vw" direction="column" align="center">
          <Flex
            className={`${isMobileResponsive ? "column-flex" : "row-flex"}`}
            p="10"
            w="100%"
            align="center"
            justify="space-around"
          >
            <Box maxW="600px" borderRadius="lg">
              <Text p="" fontSize="4xl" fontWeight="bold">
                Latest News
              </Text>
              <Divider
                data-aos="fade-up"
                size="3"
                borderWidth="3px"
                borderColor="green"
                w="50%"
                mb="50px"
              />
              <div className="scrollable-news">{mappedNews}</div>
            </Box>
            {!isMobileResponsive && (
              <Flex data-aos-delay="200" data-aos="fade">
                <Box maxW="500px" className="school-svg">
                  <News />
                </Box>
              </Flex>
            )}
          </Flex>
        </Flex>
        <Flex   position="relative">
          <Box position="absolute" className="greenwave" w="100%">
            <Greenwave />
          </Box>
          <Box w="100%">
            <Center>
              <Text color="white" fontSize="5xl" as="b" pb="10vw">
                Facilities
              </Text>
            </Center>
            <Flex align="center" justify="space-between" w="100%" p="5">
              <SimpleGrid minChildWidth="200px" spacing="5%">
                <Card>
                  <CardHeader>Green Campus</CardHeader>
                  <CardBody>
                    In this era of concrete dominance, we aim at making children
                    live in a natural and healthy environment. The school has a
                    lush green campus which is essential for a pollution free
                    surrounding for the children.
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>Boarding</CardHeader>
                  <CardBody>
                    Experience a transformative boarding journey at Saluja Gold
                    International School, known as the best boarding school in
                    Giridih. With a perfect blend of academic excellence,
                    holistic development, and a nurturing environment, we ensure
                    the all-round growth and success of our students.
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>Science Lab</CardHeader>
                  <CardBody>
                    Saluja Gold International School in Giridih is equipped with
                    multiple state-of-the-art laboratories to provide students
                    with hands-on learning experiences and foster their
                    curiosity and scientific inquiry. Here are some of the
                    exceptional labs available:
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>Sweat-it-out Zone</CardHeader>
                  <CardBody>
                    The school boasts of a huge complex for various sports
                    activity where we offer a range of indoor and outdoor games,
                    like football, cricket, badminton, basketball, volleyball,
                    chess, and table tennis.
                  </CardBody>
                </Card>
              </SimpleGrid>
            </Flex>
          </Box>
        </Flex>
        <Box
          mt={`${isMobileResponsive ? "40%" : "20%"}`}
          w="100%"
          mb={`${isMobileResponsive ? "20%" : "0"}`}
          display="flex"
          align={isMobileResponsive && ""}
          justifyContent="space-around"
          flexDirection={`${isMobileResponsive ? "column" : "row"}`}
        >
          <Flex
            w={`${isMobileResponsive ? "98vw" : "40vw"}`}
            flexDirection="column"
            justify="center"
            align="start"
            fontSize="xl" p='3'
          >
            <Text mb="9" fontSize="4xl" as="b">
              Our Toppers
              <Divider
                data-aos="fade-up"
                size="3"
                borderWidth="3px"
                borderColor="green"
              />
            </Text>
            <Text >
              We proudly celebrate the remarkable achievements of our school's
              top performers. Each student's dedication and hard work have
              culminated in outstanding academic success, setting an inspiring
              example for their peers. These achievements underscore our
              commitment to fostering holistic growth and learning excellence.
              Congratulations to all our brilliant students for their
              accomplishments. Your perseverance and commitment fuel our
              school's pride and reinforce the value of diligence in education.
              As you continue to strive for greatness, remember that your
              potential knows no bounds.
            </Text>
          </Flex>
          <Flex w={`${isMobileResponsive ? '100vw' : '40vw'}`} flexDir="column" align="center" justify="center">
            <Box
              className="carousel2"
              width={`${isMobileResponsive ? "90vw" : "40vw"}`}
            >
              <Carousel2
                arrows={false}
                width={`${isMobileResponsive ? "90vw" : "25vw"}`}
                height={"auto"}
                autoScrollInterval={1000}
                carouselStyle={"3d"}
              >
                {toppersList != null ? (
                  toppersList.map((topper) => (
                    <div key={topper.id}>
                      <img src={topper.url} alt="" />
                      <Box w="100%" position="absolute" bottom="0px">
                        <Text
                          textAlign="center"
                          backgroundColor="black"
                          color="white"
                          position="relative"
                        >
                          {topper.name}
                        </Text>
                        <Text
                          textAlign="center"
                          backgroundColor="black"
                          color="white"
                          position="relative"
                        >
                          {topper.result}%
                        </Text>
                      </Box>
                    </div>
                  ))
                ) : (
                  <Text>Loading...</Text>
                )}
              </Carousel2>
              <Text textAlign="center" as="b">
                Class 10th (Matriculation)
              </Text>
            </Box>
            <Box
              mt="5"
              className="carousel2"
              width={`${isMobileResponsive ? "90vw" : "40vw"}`}
            >
              <Carousel2
                arrows={false}
                width={`${isMobileResponsive ? "90vw" : "25vw"}`}
                height={"auto"}
                autoScrollInterval={1000}
                carouselStyle={"3d"}
              >
                {toppersList12 != null ? (
                  toppersList12.map((topper) => (
                    <div key={topper.id}>
                      <img src={topper.url} alt="" />
                      <Box w="100%" position="absolute" bottom="0px">
                        <Text
                          textAlign="center"
                          backgroundColor="black"
                          color="white"
                          position="relative"
                        >
                          {topper.name}
                        </Text>
                        <Text
                          textAlign="center"
                          backgroundColor="black"
                          color="white"
                          position="relative"
                        >
                          {topper.result}%
                        </Text>
                      </Box>
                    </div>
                  ))
                ) : (
                  <Text>Loading...</Text>
                )}
              </Carousel2>

              <Text as="b">Class 12th (Intermediate)</Text>
            </Box>
          </Flex>
        </Box>
        <Box mt='20vh'
        mb='10vh'
        position='relative'>
          <Text as='b' fontSize='3xl'>
            School Gallery
            <Divider
            data-aos="fade-right"
            size="3"
            w="60%"
            borderWidth="3px"
            borderColor="green"
          />
          </Text>
        </Box>

        <Box minH="100vh" w="100%" p={4}>
      {/* Container for the rectangular layout */}
      <Box
        maxW={{ base: "100%", md: "80%" }} // Adjust the max width for responsiveness
        w="100%"
        p={4}
        mx="auto" // Center the container horizontally
        boxShadow="lg"
        borderRadius="md"
        background="#fff" // Background color of the container
      >
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} // Adjust the number of columns for mobile and desktop
          gap={4}
          justifyItems="center"
          alignItems="center"
        >
          {images.map((imageUrl, index) => (
            <Center
              key={index}
              position="relative"
              cursor="pointer"
              _hover={{ transform: "scale(1.1)" }}
            >
              <Image
                src={imageUrl}
                alt={`Image ${index}`}
                maxW="100%"
                maxH="100%"
                objectFit="cover"
              />
            </Center>
          ))}
        </Grid>
      </Box>
    </Box>
        {/* <Box maxH="100vh" w="100%" 
        mb='40vh' 
        p={4} position='relative'>
      <Box
        maxW="1200px"
        w="90%"
        p={4}
        mx="auto" // Center the container horizontally
        boxShadow="lg"
        borderRadius="md"
        background="#fff" // Background color of the container
      >
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={4}
          justifyItems="center"
          alignItems="center"
        >
          {images.map((imageUrl, index) => (
            <Box
              key={index}
              position="relative"
              cursor="pointer"
            >
              <Image
                src={imageUrl}
                alt={`Image ${index}`}
                maxW="100%"
                maxH="100%"
                objectFit="cover"
                transition="transform 0.3s"
                _hover={{ transform: "scale(1.1)" }}
              />
            </Box>
          ))}
        </Grid>
      </Box>
    </Box> */}
        <Text fontSize="3xl" as="b" p='3'>
          Take enquiry of anything you wish to know !
          <Divider
            data-aos="fade-right"
            size="3"
            w="30%"
            borderWidth="3px"
            borderColor="green"
          />
        </Text>
        <Flex 
        position="relative" 
        align="center" 
        justify="center" 
        minH={`${isMobileResponsive} ? '100vh' : '100vh' `} 
        w='100%'
        mb='10%'>
          <Flex 
          flexDir='column' 
          align='center' 
          w={`${isMobileResponsive ? '100vw' : '80vw'}`}
          mt='5%'>
            <form onSubmit={handleSubmit} style={{'width': '60%'}}>
              <FormControl id="name">
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </FormControl>
              <Stack direction="row" spacing={4}>
                <Checkbox
                  name="Admission"
                  isChecked={formData.option1}
                  onChange={handleInputChange}
                >
                  For Admission
                </Checkbox>
                <Checkbox
                  name="Job"
                  isChecked={formData.option2}
                  onChange={handleInputChange}
                >
                  For Job
                </Checkbox>
              </Stack>
              <FormControl id="age">
                <FormLabel>Age</FormLabel>
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="purpose">
                <FormLabel>Purpose</FormLabel>
                <Input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="phoneNumber">
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="email">
                <FormLabel>Email ID</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </FormControl>
              <Button mt={4} colorScheme="teal" type="submit">
                Submit
              </Button>
            </form>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
