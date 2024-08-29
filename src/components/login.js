import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./config/firebase-config";
import {
  Stack,
  Box,
  Heading,
  Input,
  Button,
  Center,
  Flex,
  Spacer,
  Text,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Radio,
  RadioGroup,
  Alert,
} from "@chakra-ui/react";

import { collection, setDoc, doc, query, where, getDocs } from "firebase/firestore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [course, setCourse] = useState("");
  const [yearOfPassout, setYearOfPassout] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleInCompany, setRoleInCompany] = useState("");
  const [isLogin, setIsLogin] = useState(true); // State to track whether the user is in login or signup mode
  const [userType, setUserType] = useState(); // Default user type is student
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");

  const navigate = useNavigate();



  const studentCollectionRef = collection(db, "studentDetails");
  const alumniCollectionRef = collection(db, "alumni");
 
  

//   useEffect(() => {
//     if (user) {
      
//       console.log(user)
//       switch (userType) {
//         case 'student':
//           navigate('/student-dashboard');
//           break;
//         case 'alumni':
//           navigate('/alumni-dashboard');
//           break; 
//         case 'admin':
//           navigate('/admin');
//           break;
//         default:
//           // Handle unknown identity or redirect to a default page
//           break;
//       }
//     }
//   }, [user, navigate]);




  const getUserIdentity = async (userType, userEmail) => {
    try {

    if(userType == "student"){
    const q = query(collection(db, 'studentDetails'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.docs[0];
    const data =  { id: doc.id, ...doc.data() };
    console.log(data)

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = { id: doc.id, ...doc.data() };
        console.log(data)
        navigate('/studentDashboard', { state: data });
      } else {
        console.log('No matching student found');
        alert("The entered details is not for a student.")
        // You can optionally show an error message or handle the case when no student is found
      }
    }
    else if(userType == 'alumni'){
      
        const q = query(collection(db, 'alumni'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        const doc = querySnapshot.docs[0];
        console.log(doc)
        const data =  {...doc.data() };
        console.log(data)

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        console.log(doc)
        const data = {...doc.data() };
        navigate('/alumniDashboard', { state: data });
      } else {
        console.log('No matching student found');
        alert("The entered details is not for a Alumni.")
        // You can optionally show an error message or handle the case when no student is found
      }
    }
    else if(email == "admin@school.com"){
      // const q = query(collection(db, 'alumni'), where('email', '==', "admin@school.com"));
      //   const querySnapshot = await getDocs(q);
      //   const doc = querySnapshot.docs[0];
      //   const data =  { id: doc.id, ...doc.data() };
      //   console.log(data)

    if (email == "admin@school.com") {
        // const doc = querySnapshot.docs[0];
        // const data = { id: doc.id, ...doc.data() };
        console.log("yes")
        navigate('/admin');
      } else {
        console.log('No matching student found');
        alert("The entered details is not for a Admin.")
        // You can optionally show an error message or h
    }}
    else{
      console.log("no user found");
    }
      // Handle admin or other user types here
    } catch (error) {
      console.error('Error fetching user identity:', error);
      alert("Error fetching user identity: ", error);
    }
  };



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
       getUserIdentity(userType, email)
      console.log("logged in successfully");
    } catch (err) {
      // Handle login errors
      handleAuthError(err);
      alert(err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("user signed up successfully");
      // You may choose to automatically log in the user after signing up
      await handleLogin(e);

      // Add user to the appropriate collection based on user type
      if (userType === "student") {

        const customId = "user" + admissionNo;
      const docRef = doc(studentCollectionRef, customId);


      await setDoc(docRef, 
        {
            identity: "student",
            name,
            email,
            admissionNo,
            course,
          }
    )
      } else if (userType === "alumni") {

        const customId = "alumni" + email;
        const docRef = doc(alumniCollectionRef, customId);
        await setDoc(docRef, 
        {
          identity: "alumni",
          name,
          yearOfPassout,
          companyName,
          roleInCompany,
          email,
        })
      }
    } catch (err) {
      // Handle signup errors
      handleAuthError(err);

    }
  };

  const handleAuthError = (err) => {
    // Check error code to determine the type of error
    if (err.code === "auth/user-not-found") {
      setErrorMessage("User not found. Please sign up first.");
    } else if (err.code === "auth/wrong-password") {
      setErrorMessage("Incorrect password. Please try again.");
    } else {
      setErrorMessage("An error occurred. Please try again later.");
    }
    setShowErrorDialog(true);
    console.error(err);
  };

  const handleCloseErrorDialog = () => {
    setShowErrorDialog(false);
  };


  const handleResetPassword = async () => {
    try {
        await sendPasswordResetEmail(auth, resetPasswordEmail);
        console.log("Password reset email sent successfully");
        // Optionally, close the modal after sending the email
        handleCloseForgotPasswordModal();
        alert("Check for email to reset password")
    } catch (error) {
        console.error("Error sending password reset email:", error);
        alert("Error sending password reset email:", error)
        // Handle error, maybe show it to the user
    }
};


  const handleOpenForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
};

const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
};

  return (
    <Center zIndex="15" height="100vh" backgroundColor="#213555">
      <Box
        borderWidth="1px"
        borderRadius="md"
        p="8"
        width="300px"
        backgroundColor={"white"}
      >
        <Heading size="md" mb="4">
          {isLogin ? "Sign In" : "Sign Up"}
        </Heading>
        {isLogin && 
        <RadioGroup mb="4" onChange={setUserType} value={userType}>
        <Stack direction="row">
          <Radio value="student">Student</Radio>
          <Radio value="alumni">Alumni</Radio>
          <Radio value="admin">Admin</Radio>
        </Stack>
      </RadioGroup>
        }
        {!isLogin && (
          <>
            <RadioGroup mb="4" onChange={setUserType} value={userType}>
              <Stack direction="row">
                <Radio value="student">New Student</Radio>
                <Radio value="alumni">New Alumni</Radio>
              </Stack>
            </RadioGroup>

            <Input
              placeholder="Name"
              mb="4"
              onChange={(e) => setName(e.target.value)}
            />
            {userType === "alumni" && (
              <>
                <Input
                  placeholder="Year of Passout"
                  mb="4"
                  onChange={(e) => setYearOfPassout(e.target.value)}
                />
                <Input
                  placeholder="Company Name"
                  mb="4"
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <Input
                  placeholder="Role in Company"
                  mb="4"
                  onChange={(e) => setRoleInCompany(e.target.value)}
                />
              </>
            )}
            {userType === "student" && (
              <>
                <Select
  placeholder="Select Course"
  mb="4"
  onChange={(e) => setCourse(e.target.value)}
>
  <option value="BTech">BTech</option>
  <option value="BCA">BCA</option>
  <option value="BBA">BBA</option>
  <option value="BA LLB">BA LLB</option>
  <option value="BA">BA</option>
  <option value="YOGA BSC">YOGA BSC</option>
  <option value="YOGA MSC">YOGA MSC</option>

</Select>
                <Input
                  placeholder="Admission No."
                  mb="4"
                  onChange={(e) => setAdmissionNo(e.target.value)}
                />
              </>
            )}
          </>
        )}
        
        <Input
          placeholder="Email"
          mb="4"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          mb="4"
          onChange={(e) => setPassword(e.target.value)}
        />

        {isLogin ? (
          <Button onClick={handleLogin} colorScheme="blue" width="100%">
            Login
          </Button>
        ) : (
          <Button onClick={handleSignup} colorScheme="blue" width="100%">
            Sign Up
          </Button>
        )}
        <Flex flexDir="column" mt="4">
          <Spacer />
          <Text
            onClick={() => setIsLogin(!isLogin)}
            cursor="pointer"
            color="blue.500"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Text>

          <Text
            onClick={handleOpenForgotPasswordModal}
            cursor="pointer"
            color="blue.500"
          >
            Forgot Password
          </Text>
          <Text
            onClick={()=> navigate('/clubAdminLoginPage')}
            cursor="pointer"
            color="blue.700"
          >
            Click here for Club Admin Login
          </Text>
        </Flex>


        <Modal
          isOpen={showForgotPasswordModal}
          onClose={handleCloseForgotPasswordModal}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Forgot Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Enter your email"
               
                onChange={(e) => setResetPasswordEmail(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleResetPassword}>
                Send Reset Email
              </Button>
              <Button variant="ghost" onClick={handleCloseForgotPasswordModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>


        <Modal isOpen={showErrorDialog} onClose={handleCloseErrorDialog}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Error</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{errorMessage}</ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleCloseErrorDialog}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Center>
  );
};

export default LoginPage;
