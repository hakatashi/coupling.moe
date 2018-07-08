import {firebaseAction, firebaseMutations} from 'vuexfire';
import Vuex from 'vuex';
import db from '~/lib/db.js';

const store = () => new Vuex.Store({
	state: {
		hoge: null,
	},
});

export default store;
