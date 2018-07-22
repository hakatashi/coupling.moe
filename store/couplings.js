import db from '~/lib/db.js';
import {firebaseAction} from 'vuexfire/out/index.js';

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
	getByCharacter: (state) => (
		(character) => (
			[...state.list, ...Object.values(state.data)].filter((datum) => datum.members[character] === true)
		)
	),
	getByCharacterNames: (state, getters, rootState, rootGetters) => (
		(names) => {
			const characters = names.map((name) => rootGetters['characters/getByName'](name));
			return [...state.list, ...Object.values(state.data)].filter((datum) => (
				characters.every((character) => (
					datum.members[character.id] === true
				))
			));
		}
	),
};

const localActions = {
	async initList({state, dispatch, commit}) {
		if (!state.isInitList) {
			await dispatch('bindList');
			commit('initList');
		}
	},
	bindList: firebaseAction(({bindFirebaseRef}) => {
		bindFirebaseRef('list', couplingsRef);
	}),
	bind: firebaseAction(async ({bindFirebaseRef, state}, id) => {
		if (state.data[id] !== undefined) {
			return;
		}

		const couplingRef = couplingsRef.doc(id);
		bindFirebaseRef(`data.${id}`, couplingRef);
		await couplingRef.get();
	}),
	async bindByCharacterNames({dispatch, rootGetters}, characterNames) {
		await Promise.all(characterNames.map((name) => (
			dispatch('characters/bindByName', name, {root: true})
		)));

		const characters = characterNames.map((name) => rootGetters['characters/getByName'](name));

		let couplingsQuery = couplingsRef;
		for (const character of characters) {
			couplingsQuery = couplingsQuery.where(`members.${character.id}`, '==', true);
		}
		const couplings = await couplingsQuery.get();

		await Promise.all(couplings.docs.map((coupling) => (
			dispatch('bind', coupling.id)
		)));
	},
};

export {
	localState as state,
	localMutations as mutations,
	localGetters as getters,
	localActions as actions,
};
