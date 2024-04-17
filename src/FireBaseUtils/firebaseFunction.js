// firestoreUtils.js
import { addDoc, getDocs, deleteDoc, doc, collection } from 'firebase/firestore';
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
