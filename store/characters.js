import db from '~/lib/db.js';
import {firebaseAction} from 'vuexfire/out/index.js';

const charactersRef = db.collection('characters');
const couplingsRef = db.collection('couplings');

const localState = () => ({
	isInitList: false,
	list: [],
	data: {},
});

const localMutations = {
	initList(state) {
		state.isInitList = true;
	},
};

const localGetters = {
	list: (state) => state.list,
	data: (state) => state.data,
	getByName: (state) => (
		(name) => (
			[...state.list, ...Object.values(state.data)].find((datum) => datum.name === name)
		)
	),
	getMemberByName: (state) => (
		(name) => (
			Object.values(state.data).find((datum) => datum.name === name)
		)
	),
};

const localActions = {
	async initList({state, dispatch, commit}) {
		if (!state.isInitList) {
			await dispatch('bindList');
			commit('initList');
		}
	},
	bindList: firebaseAction(async ({bindFirebaseRef}) => {
		bindFirebaseRef('list', charactersRef);
		await charactersRef.get();
	}),
	bind: firebaseAction(async ({bindFirebaseRef, dispatch, getters}, name) => {
		if (getters.getMemberByName(name) !== undefined) {
			return;
		}

		const characters = await charactersRef.where('name', '==', name).get();
		if (!characters.empty) {
			const character = characters.docs[0];
			bindFirebaseRef(`data.${character.id}`, character.ref);

			const couplings = await couplingsRef.where(`members.${character.id}`, '==', true).get();
			await Promise.all(couplings.docs.map((coupling) => (
				dispatch('couplings/bind', coupling.id, {root: true})
			)));
		}
	}),
};

export {
	localState as state,
	localMutations as mutations,
	localGetters as getters,
	localActions as actions,
};
