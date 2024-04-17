import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './config/firebase-config';
import { Box, Heading, Input, Button, Center, Flex, Spacer, Text, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { addDocument, handleResetPassword } from '../FireBaseUtils/firebaseFunction';
import { collection } from 'firebase/firestore';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [admissionNo, setAdmissionNo] = useState("");
    const [course, setCourse] = useState("");
    const [name, setName] = useState("");
    const [isLogin, setIsLogin] = useState(true); // State to track whether the user is in login or signup mode
    const [isApproved, setIsApproved] = useState(false)
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const studentCollectionRef = collection(db, "notApprovedStudents")

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('logged in successfully');
            navigate('/admin');
        } catch (err) {
            // Check error code to determine the type of error
      if (err.code === 'auth/user-not-found') {
        setErrorMessage('User not found. Please sign up first.');
      } else if (err.code === 'auth/wrong-password') {
        setErrorMessage('Incorrect password. Please try again.');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
      setShowErrorDialog(true);
      console.error(err);
    }
  };

  const handleCloseErrorDialog = () => {
    setShowErrorDialog(false);
  };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('user signed up successfully');
            // You may choose to automatically log in the user after signing up
            await handleLogin(e);

            addDocument(studentCollectionRef, {name, course, admissionNo, email, isApproved});

        } catch (err) {
            console.error(err);
        }
    };


  

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/admin');
            }
        })
    }, [navigate]);

    const handleResetPasswordOfUser = async () => {
        await handleResetPassword("abhikeshri860@gmail.com")
        console.log("DONE !")
    }

    return (
        <Center height="100vh" backgroundColor='#213555'>
            <Box borderWidth="1px" borderRadius="md" p="8" width="300px" backgroundColor={'white'}>
                <Heading size="md" mb="4">
                    {isLogin ? 'Sign In' : 'Sign Up'}
                </Heading>
                {!isLogin && (
                    <>
                        <Input placeholder="Name" mb="4" onChange={(e) => setName(e.target.value)} />
                        <Select placeholder="Select Course" mb="4" value={course} onChange={(e) => setCourse(e.target.value)}>
                            <option value="Btech">BTech</option>
                            <option value="BCA">BCA</option>
                            <option value="BBA">BBA</option>
                            <option value="BA LLB">BA LLB</option>
                            <option value="BA">BA</option>
                            <option value="MBA">MBA</option>
                            <option value="YOGA BSC">Yoga BSc</option>
                            <option value="YOGA MSC">Yoga MSc</option>
                        </Select>
                        <Input placeholder="Admission Number" mb="4" onChange={(e) => setAdmissionNo(e.target.value)} />
                    </>
                )}
                <Input placeholder="Email" mb="4" onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" mb="4" onChange={(e) => setPassword(e.target.value)} />
                
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
                    <Text onClick={() => setIsLogin(!isLogin)} cursor="pointer" color="blue.500">
                        {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Sign in'}
                        
                        
                    </Text>
                    <Text onClick={()=> handleResetPasswordOfUser()} cursor="pointer" color="blue.500">
                        Forgot Password
                    </Text>
                </Flex>
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
}

export default LoginPage;



// import {auth} from './config/firebase-config'
// import {Box, Heading, Input, Button, Center} from '@chakra-ui/react'
// import { useState, useEffect } from 'react';
// import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
// import {useNavigate} from'react-router-dom';

// const LoginPage = () => {

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const navigate = useNavigate();

//     const login = async (e) =>{
//       e.preventDefault();
//         try {
//             await signInWithEmailAndPassword(auth, email, password);
//             console.log('logged in successfully')
//         }catch(err){
//             console.error(err);
//         }
//     };


//     useEffect(() =>{
//       onAuthStateChanged(auth, (user) => {
//         if(user){
//           navigate('/admin');
//         }
//       })
//     }, []);


//     return ( <>
//     <Center height="100vh" backgroundColor='#213555'>
//       <Box borderWidth="1px" borderRadius="md" p="8" width="300px" backgroundColor={'white'}>
//         <Heading size="md" mb="4">
//           Sign In
//         </Heading>
//         <Input placeholder="Email" mb="4" onChange={(e) => setEmail(e.target.value)} />
//         <Input type="password" placeholder="Password" mb="4" onChange={(e) => setPassword(e.target.value)}/>
//         <Button
//         onClick={(e)=> login(e)} colorScheme="blue" width="100%">
//           Login
//         </Button>
//       </Box>
//     </Center>
//     </> );
// }
 
// export default LoginPage;