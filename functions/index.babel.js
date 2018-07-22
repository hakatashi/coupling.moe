require('babel-polyfill');

const functions = require('firebase-functions');
const firebase = require('firebase-admin');

firebase.initializeApp();

const db = firebase.firestore();

exports.helloWorld = functions.https.onRequest((request, response) => {
	response.send('Hello from Firebase!');
});

exports.incrementCounter = functions.pubsub.topic('minute-tick').onPublish(() => {
	const counterRef = db.collection('counter').doc('counter');
	db.runTransaction(async (transaction) => {
		const counterTransaction = await transaction.get(counterRef);
		transaction.update(counterRef, {
			value: counterTransaction.data().value + 1,
		});
	});
});
