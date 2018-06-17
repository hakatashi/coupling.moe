import {firebaseAction, firebaseMutations} from 'vuexfire';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import firebase from '~/lib/firebase.js';
import localforage from 'localforage';

const db = firebase.database();
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
