import {firebaseAction, firebaseMutations} from 'vuexfire/out/index.js';
import firebase from '~/lib/firebase.js';
import db from '~/lib/db.js';

const counterRef = db.collection('counter').doc('counter');

export const state = () => ({
	isInitCounter: false,
	counter: {
		value: null,
	},
});

export const mutations = {
	...firebaseMutations,
	initCounter(state) {
		if (process.browser) {
			state.isInitCounter = true;
		}
	},
};

export const getters = {
	counter: (state) => state.counter.value,
};

export const actions = {
	async init({state, dispatch, commit}) {
		if (!state.isInitCounter) {
			await dispatch('bindCounter');
			commit('initCounter');
		}
	},
	bindCounter: firebaseAction(async ({bindFirebaseRef}) => {
		bindFirebaseRef('counter', counterRef);
		await counterRef.get();
	}),
	increment: firebaseAction((context) => {
		if (context.getters.counter !== null) {
			db.runTransaction(async(transaction) => {
				const counterTransaction = await transaction.get(counterRef);
				await transaction.update(counterRef, {value: counterTransaction.data().value + 1});
			});
		}
	}),
};
