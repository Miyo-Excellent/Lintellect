import {Storage} from '@google-cloud/storage';
//  import firebase from "firebase-admin";

const storage = new Storage({
  projectId: 'lintellect-48520',
  keyFilename: '../serviceAccountKey'
});

//  const firebaseDB = firebase.database();

//  export default {storage, firebaseDB};
export default {storage};
