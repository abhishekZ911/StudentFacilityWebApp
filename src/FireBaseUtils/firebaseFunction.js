// firestoreUtils.js
import { addDoc, getDocs, getDoc, deleteDoc, doc, collection } from 'firebase/firestore';
import { db } from '../components/config/firebase-config';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


export const addDocument = async (collectionRef, data) => {
  try {
    await addDoc(collectionRef, data);
  } catch (err) {
    console.error(err);
  }
};


export const getDocuments = async (collectionRef) => {
    try {
      const data = await getDocs(collectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id : doc.id,
      }));
      return filteredData
    } catch (err) {
      console.error(err);
    }
  };


  export const handleDeleteFromFireStore = async (collectionName,id) => {
    try {
      const deleteJobDoc = doc(db, collectionName, id);
      await deleteDoc(deleteJobDoc);
      
    } catch (err) {
      console.error(err);
    }
  };


const auth = getAuth();

export const handleResetPassword = async (email) =>{
  sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent!
    // ..
    console.log("Reset Email Sent")
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}

const fetchCollection = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clubs"));
    //   const admins = await studentDetailsByID
      const result = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      return result
}
 catch (error) {
  console.error("Error fetching collection:", error);
}
}

export const searchDocumentByID = async (collectionName,id) => {
  try {
    // Get the document reference for the student

    const entityRef = doc(db, collectionName, id);

    // Fetch the student document
    const entityDoc = await getDoc(entityRef);

    if (entityDoc.exists()) {
      // Document exists, retrieve the data
      const entity = { id: entityDoc.id, ...entityDoc.data() };
      console.log(entity)
      return entity
    } else {
      // Document does not exist
      console.log('Student not found');
      throw("No entity found")
    }
  } catch (error) {
    console.error('Error fetching student details:', error);
  }
};
