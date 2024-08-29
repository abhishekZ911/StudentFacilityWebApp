import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { Box, Input, Textarea, Button, Stack, Divider, Heading, Center, Text, UnorderedList, ListItem, Flex, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const ClubAdminPage = () => {
    // State for input fields in create section
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    // State for list of posts/events
    const [posts, setPosts] = useState([]);

    const postCollection = collection(db, 'clubs');

    const location = useLocation();
    const navigate = useNavigate();
    const clubSel = location.state;
    console.log(clubSel)


    useEffect(() => {
        // Fetch posts/events from Firestore

        if (!clubSel) {
            navigate("/login");
            return;
          }
        const fetchPosts = async () => {
            const postCollection = collection(db, 'posts');
            const snapshot = await getDocs(postCollection);
            const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
        };

        fetchPosts();
    }, []);

    // Function to handle post/event creation
    const handleCreatePost = async () => {
        // Create a new post/event document in Firestore
        const clubCollection = doc(db, "clubs", clubSel.id)
        const postCollectionRef = collection(clubCollection, "posts")

        const docRef = doc(postCollectionRef, title)

        // Update posts state with the new post/event
        setPosts([...posts, { id: docRef.id, title, content, date, time }]);

        // Reset input fields
        setTitle('');
        setContent('');
        setDate('');
        setTime('');
    };

    // Function to handle post/event deletion
    const handleDeletePost = async (postId) => {
        // Delete the post/event document from Firestore
        const postCollectionInDeletion = doc(db, "clubs", clubSel.id)
        const postCollectionRefInDeletion = collection(postCollectionInDeletion, "posts")

        const docRefOfDeletion = doc(postCollectionRefInDeletion, postId)



        await deleteDoc(docRefOfDeletion);

        // Update posts state by removing the deleted post
        setPosts(posts.filter(post => post.id !== postId));
    };

    return (<>
    <Flex flexDir="column" padding={{base: '40% 2% 2% 2%', md: '15% 5% 5% 5%', xl: '15% 5% 5% 5%'}}  backgroundColor="#213555" >
    <Text fontSize="2xl" as="b" color="#fff">
                {clubSel.clubName}
        </Text>
        <Center>
        <Text fontSize="2xl" as="b" color="#fff">
                Welcome Club Admin !
        </Text>
        
        
        </Center>
        
        <Flex >
            <Box width="60%" margin="3%" padding="2%" backgroundColor="#fff" borderRadius="10">
                <Heading size="md" mb="2">Create Post/Event</Heading>
                <Stack spacing="4">
                    <Input 
                        placeholder="Title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                    <Textarea 
                        placeholder="Content" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                    />
                    <Input 
                        type="date" 
                        placeholder="Date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                    />
                    <Input 
                        type="time" 
                        placeholder="Time" 
                        value={time} 
                        onChange={(e) => setTime(e.target.value)} 
                    />
                    <Button onClick={handleCreatePost} colorScheme="blue">Create</Button>
                </Stack>
            </Box>

            {/* List of Posts/Events Section */}
            <Box width="40%" margin="3%" padding="2%" backgroundColor="#fff" borderRadius="10">
                <Heading size="md" mb="2">List of Posts/Events</Heading>
                <UnorderedList>
                    {posts.map((post, index) => (
                        <ListItem key={post.id}>
                            <Heading size="sm">{post.title}</Heading>
                            <p>{post.content}</p>
                            <p>{post.date} at {post.time}</p>
                            <IconButton 
                                icon={<DeleteIcon />} 
                                colorScheme="red" 
                                size="sm" 
                                onClick={() => handleDeletePost(post.id)} 
                            />
                        </ListItem>
                    ))}
                </UnorderedList>
            </Box>
        </Flex>
        </Flex>
        </>
    )
    ;
};

export default ClubAdminPage;
