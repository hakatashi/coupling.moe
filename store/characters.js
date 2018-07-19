import {firebaseAction, firebaseMutations} from 'vuexfire/out/index.js';
import firebase from '~/lib/firebase.js';
import db from '~/lib/db.js';

const charactersRef = db.collection('characters');

export const state = () => ({
	isInitList: false,
	list: null,
	data: {},
});

export const mutations = {
	initList(state) {
		state.isInitList = true;
	},
};

export const getters = {
	list: (state) => state.list,
	data: (state) => state.data,
};

export const actions = {
	async initList({state, dispatch, commit}) {
		if (!state.isInitList) {
			await dispatch('bindList');
			commit('initList');
		}
	},
	bindList: firebaseAction(({bindFirebaseRef}) => {
		bindFirebaseRef('list', charactersRef);
	}),
	bind: firebaseAction(async ({bindFirebaseRef, state}, name) => {
		if (state.data[name] !== undefined) {
			return;
		}

		const characters = await charactersRef.where('name', '==', name).get();
		if (!characters.empty) {
			bindFirebaseRef(`data.${name}`, characters.docs[0].ref);
		}
	}),
};
