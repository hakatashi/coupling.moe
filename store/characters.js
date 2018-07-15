import {firebaseAction, firebaseMutations} from 'vuexfire';
import Vuex from 'vuex';
import firebase from '~/lib/firebase.js';
import db from '~/lib/db.js';

const charactersRef = db.collection('characters');

export const state = () => ({
	list: null,
});

export const mutations = firebaseMutations;

export const getters = {
	list: (state) => state.list,
};

export const actions = {
	init: firebaseAction(({bindFirebaseRef}) => {
		bindFirebaseRef('list', charactersRef);
	}),
};
