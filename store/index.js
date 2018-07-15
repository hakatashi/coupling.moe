import {firebaseAction, firebaseMutations} from 'vuexfire';
import Vuex from 'vuex';
import firebase from '~/lib/firebase.js';
import db from '~/lib/db.js';

const counterRef = db.collection('counter').doc('counter');

export const state = () => ({
	counter: {
		value: null,
	},
});

export const mutations = firebaseMutations;

export const getters = {
	counter: (state) => state.counter.value,
};

export const actions = {
	init: firebaseAction(({bindFirebaseRef}) => {
		bindFirebaseRef('counter', counterRef);
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
