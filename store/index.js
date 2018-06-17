import {firebaseAction, firebaseMutations} from 'vuexfire';
import Vuex from 'vuex';
import firebase from 'firebase';

if (firebase.apps.length === 0) {
	firebase.initializeApp({
		databaseURL: 'https://coupling-moe.firebaseio.com/',
	});
}

const firebaseApp = firebase.apps[0];

const db = firebaseApp.database();
const counterRef = db.ref('counter');

const store = () => new Vuex.Store({
	state: {
		counter: {
			'.value': null,
		},
	},
	mutations: firebaseMutations,
	getters: {
		counter: (state) => state.counter['.value'],
	},
	actions: {
		init: firebaseAction(({bindFirebaseRef}) => {
			bindFirebaseRef('counter', counterRef);
		}),
		increment: firebaseAction((context) => {
			if (context.getters.counter !== null) {
				counterRef.set(context.getters.counter + 1);
			}
		}),
	},
});

export default store;
