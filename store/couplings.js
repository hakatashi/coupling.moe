import {firebaseAction, firebaseMutations} from 'vuexfire/out/index.js';
import firebase from '~/lib/firebase.js';
import db from '~/lib/db.js';

const couplingsRef = db.collection('couplings');

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
		bindFirebaseRef('list', couplingsRef);
	}),
	bind: firebaseAction(({bindFirebaseRef, state}, id) => {
		if (state.data[name] !== undefined) {
			return;
		}

		bindFirebaseRef(`data.${id}`, couplingsRef.doc(id));
	}),
};
