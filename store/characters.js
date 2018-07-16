import {firebaseAction} from 'vuexfire';
import Vuex from 'vuex';
import firebase from '~/lib/firebase.js';
import db from '~/lib/db.js';

const charactersRef = db.collection('characters');

export const state = () => ({
	list: null,
	data: {},
});

export const getters = {
	list: (state) => state.list,
	data: (state) => state.data,
};

export const actions = {
	bindAll: firebaseAction(({bindFirebaseRef}) => {
		bindFirebaseRef('list', charactersRef);
	}),
	bind: firebaseAction(async ({bindFirebaseRef}, name) => {
		const characters = await charactersRef.where('name', '==', name).get();
		if (!characters.empty) {
			bindFirebaseRef(`data.${name}`, characters.docs[0].ref);
		}
	}),
};
