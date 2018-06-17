import {firebaseAction, firebaseMutations} from 'vuexfire';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import firebase from 'firebase';
import localforage from 'localforage';

if (firebase.apps.length === 0) {
	firebase.initializeApp({
		databaseURL: 'https://coupling-moe.firebaseio.com/',
	});
}

const firebaseApp = firebase.apps[0];

const db = firebaseApp.database();
const counterRef = db.ref('counter');

const vuexLocal = new VuexPersist({
	storage: localforage,
});

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
	plugins: [vuexLocal.plugin],
});

export default store;
