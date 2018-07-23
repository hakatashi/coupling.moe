import db from '~/lib/db.js';
import {firebaseAction} from 'vuexfire/out/index.js';

const charactersRef = db.collection('characters');
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
		if (!state.isInitList) {
			await dispatch('bindList');
			commit('initList');
		}
	},
	bindList: firebaseAction(async ({bindFirebaseRef}) => {
		await bindFirebaseRef('list', charactersRef);
	}),
	bindByName: firebaseAction(async ({bindFirebaseRef, state, dispatch, getters, commit}, name) => {
		const localCharacter = getters.getMemberByName(name);
		if (localCharacter !== undefined && state.isInitData[localCharacter.id] === true) {
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
