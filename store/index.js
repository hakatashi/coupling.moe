import {firebaseAction, firebaseMutations} from '~/lib/vuexfire.js';
import firebase from '~/lib/firebase.js';
import db from '~/lib/db.js';

const counterRef = db.collection('counter').doc('counter');

export const state = () => ({
	isInitCounter: null,
	counter: {
		value: null,
	},
});

export const mutations = {
	...firebaseMutations,
	initCounter(state) {
		state.isInitCounter = process.browser;
	},
};

export const getters = {
	counter: (state) => state.counter.value,
};

export const actions = {
	async init({state, dispatch, commit}) {
		if (state.isInitCounter !== process.browser) {
			await dispatch('bindCounter');
			commit('initCounter');
		}
	},
	bindCounter: firebaseAction(async ({bindFirebaseRef}) => {
		await bindFirebaseRef('counter', counterRef);
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
