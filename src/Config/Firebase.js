import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCTcv7ZFrZNhwP9mCk9w25QQM_DXliS3fI",
    authDomain: "socialmediaproj-7ac92.firebaseapp.com",
    databaseURL: "https://socialmediaproj-7ac92.firebaseio.com",
    projectId: "socialmediaproj-7ac92",
    storageBucket: "socialmediaproj-7ac92.appspot.com",
    messagingSenderId: "235743235554",
    appId: "1:235743235554:web:1fde68f39c9d622a3dfdbb",
    measurementId: "G-R0BGHCV1M5"
};
// Initialize Firebase
const Firebase = firebase.initializeApp(firebaseConfig);

export default Firebase;