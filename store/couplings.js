import db from '~/lib/db.js';
import {firebaseAction} from '~/lib/vuexfire.js';

const couplingsRef = db.collection('couplings');

const localState = () => ({
	isInitList: null,
	list: [],
	isInitData: {},
	data: {},
});

const localMutations = {
	initList(state) {
		state.isInitList = process.browser;
	},
	initData(state, id) {
		state.isInitData[id] = process.browser;
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
	bindList: firebaseAction(async ({bindFirebaseRef}) => {
		await bindFirebaseRef('list', couplingsRef);
	}),
	bind: firebaseAction(async ({bindFirebaseRef, state, commit}, id) => {
		if (state.isInitData[id] === process.browser) {
			return;
		}

		const couplingRef = couplingsRef.doc(id);
		commit('initData', id);
		await bindFirebaseRef(`data.${id}`, couplingRef);
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
		return couplings.docs[0].id;
	},
};

export {
	localState as state,
	localMutations as mutations,
	localGetters as getters,
	localActions as actions,
};
