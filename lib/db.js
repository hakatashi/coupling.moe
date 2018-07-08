import firebase from './firebase';

const db = firebase.firestore();
if (process.browser) {
	db.settings({timestampsInSnapshots: true});
}

export default db;
