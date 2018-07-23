import db from '~/lib/db.js';
import {firebaseAction} from 'vuexfire/out/index.js';

const couplingsRef = db.collection('couplings');

const localState = () => ({
	isInitList: false,
	list: [],
	isInitData: {},
	data: {},
});

const localMutations = {
	initList(state) {
		if (process.browser) {
			state.isInitList = true;
		}
	},
	initData(state, id) {
		if (process.browser) {
			state.isInitData[id] = true;
		}
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
			if (characters.some((character) => character === undefined)) {
				return [];
			}
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
	bind: firebaseAction(async ({bindFirebaseRef, state, commit}, id) => {
		if (state.isInitData[id] === true) {
			return;
		}

		const couplingRef = couplingsRef.doc(id);
		bindFirebaseRef(`data.${id}`, couplingRef);
		commit('initData', id);
		await couplingRef.get();
	}),
	async bindByCharacterNames({dispatch, rootGetters}, characterNames) {
		// TODO: データ取得ではなくIDを取得した段階でresolveすることができる
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
