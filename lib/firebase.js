import firebase from 'firebase/app';
import 'firebase/messaging';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';

if (firebase.apps.length === 0) {
	firebase.initializeApp({
		apiKey: 'AIzaSyA7nQuhfLTzgr8pXc1ZrJXub1uYZP1PsKY',
		authDomain: 'coupling-moe.firebaseapp.com',
		databaseURL: 'https://coupling-moe.firebaseio.com',
		projectId: 'coupling-moe',
		storageBucket: 'coupling-moe.appspot.com',
		messagingSenderId: '427798181322',
	});
}

export default firebase.apps[0];
