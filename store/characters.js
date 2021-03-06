import db from '~/lib/db.js';
import {firebaseAction} from '~/lib/vuexfire.js';

const charactersRef = db.collection('characters');
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
	anotatedData: (state) => Object.entries(state.data).map(([id, datum]) => ({...datum, id})),
	getByName: (state, getters) => (
		(name) => (
			[...state.list, ...getters.anotatedData].find((datum) => datum.name === name)
		)
	),
	getMemberByName: (state, getters) => (
		(name) => (
			getters.anotatedData.find((datum) => datum.name === name)
		)
	),
};

const localActions = {
	async initList({state, dispatch, commit}) {
		if (state.isInitList !== process.browser) {
			await dispatch('bindList');
			commit('initList');
		}
	},
	bindList: firebaseAction(async ({bindFirebaseRef}) => {
		await bindFirebaseRef('list', charactersRef);
	}),
	bindByName: firebaseAction(async ({bindFirebaseRef, state, dispatch, getters, commit}, name) => {
		const localCharacter = getters.getMemberByName(name);
		if (localCharacter !== undefined && state.isInitData[localCharacter.id] === process.browser) {
			return;
		}

		const characters = await charactersRef.where('name', '==', name).get();
		if (!characters.empty) {
			const character = characters.docs[0];
			const characterBindPromise = bindFirebaseRef(`data.${character.id}`, character.ref);
			commit('initData', character.id);

			const couplings = await couplingsRef.where(`members.${character.id}`, '==', true).get();
			await Promise.all([
				characterBindPromise,
				...couplings.docs.map((coupling) => (
					dispatch('couplings/bind', coupling.id, {root: true})
				)),
			]);
		}
	}),
};

export {
	localState as state,
	localMutations as mutations,
	localGetters as getters,
	localActions as actions,
};
