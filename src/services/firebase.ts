import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

async function getDataCollection(collection: string) {
  let data: Array<FirebaseFirestoreTypes.DocumentData> = [];
  await firestore()
    .collection(collection)
    .get()
    .then((querySnapshot) => {
      querySnapshot &&
        querySnapshot.forEach((documentSnapshot) => {
          data.push(documentSnapshot.data());
        });
    });
  return data;
}

async function getDataDoc(doc: string) {
  let data: FirebaseFirestoreTypes.DocumentData | undefined;
  await firestore()
    .doc(doc)
    .get()
    .then((documentSnapshot) => {
      if (documentSnapshot.exists) {
        data = documentSnapshot.data();
      }
    });
  return data;
}

function getDoc(doc: string) {
  return firestore().doc(doc);
}

async function addDataDoc(doc: string, data: any) {
  firestore()
    .doc(doc)
    .set(data)
    .then(() => {
      console.log('Doc added!');
    });
}

async function updateDataDoc(doc: string, data: any) {
  firestore()
    .doc(doc)
    .update(data)
    .then(() => {
      console.log('Doc updated!');
    });
}

export {getDataCollection, getDataDoc, addDataDoc, updateDataDoc, getDoc};
