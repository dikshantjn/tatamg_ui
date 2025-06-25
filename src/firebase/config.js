import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA4RBpkDfIFjPPoiQyP6LkHB_cILz-tekU",
    authDomain: "vedikahealthcare-59980.firebaseapp.com",
    projectId: "vedikahealthcare-59980",
    storageBucket: "vedikahealthcare-59980.firebasestorage.app",
    messagingSenderId: "1021794706756",
    appId: "1:1021794706756:web:743a02ce8dda477751e311",
    measurementId: "G-8KJ946S3EF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 