import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase-config';
import { Box, Heading, Input, Button, Center, Text, Select } from '@chakra-ui/react';
import { collection, getDocs } from 'firebase/firestore';

const ClubAdminLoginPage = () => {
    const [selectedClub, setSelectedClub] = useState();
    const [admissionNo, setAdmissionNo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [clubList, setClubList] = useState([]);

    useEffect(() => {
        // Fetch club list from Firestore
        const fetchClubs = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "clubs"));
                const clubs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setClubList(clubs);
            } catch (error) {
                console.error("Error fetching club list:", error);
            }
        };

        fetchClubs();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            
            verifyAdmin();
            console.log('logged in successfully');
        } catch (err) {
            console.error(err);
            alert('Login failed. Please check your credentials and try again.');

        }
    };

    const verifyAdmin = () =>{
        
        const clubSel = clubList.find(club => club.id == selectedClub)

        setSelectedClub(clubSel)
        const admins = selectedClub.admins;
        console.log(clubSel.admins.admin1.id)
        if (("user" + admissionNo) !== clubSel.admins.admin1.id && ("user" +  admissionNo) !== clubSel.admins.admin2.id) {
            alert('You are not authorized to access this club.');
            navigate('/clubAdminLoginPage');
        } else {
            navigate('/clubAdminPage', {state : clubSel});
        }
        
    }
    return (
        <Center height="100vh" backgroundColor='#213555'>
            <Box borderWidth="1px" borderRadius="md" p="8" width="300px" backgroundColor={'white'}>
                <Heading size="md" mb="4">Club Admin Sign In</Heading>
                <Select
                    onChange={(e) => setSelectedClub(e.target.value)}
                    placeholder="Select Club"
                    value={selectedClub}
                    mb="4"
                >
                    {clubList.map((club) => (
                        <option key={club.id} value={club.id}>{club.clubName}</option>
                    ))}
                </Select>
                <Input placeholder="Admission Number" mb="4" onChange={(e) => setAdmissionNo(e.target.value)} />
                <Input placeholder="Email" mb="4" onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" mb="4" onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={handleLogin} colorScheme="blue" width="100%">Sign In</Button>
                <Text
                mt="2"
            onClick={()=> navigate('/login')}
            cursor="pointer"
            color="blue.500"
          >
            Student/Alumni/Admin Login
          </Text>
            </Box>
        </Center>
    );
};

export default ClubAdminLoginPage;
