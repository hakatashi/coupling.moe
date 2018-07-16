const firebase = require('firebase/app');
require('firebase/messaging');
require('firebase/database');
require('firebase/auth');
require('firebase/firestore');

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

module.exports = firebase.apps[0];
