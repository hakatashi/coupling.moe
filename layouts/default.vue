<template>
	<v-app>
		<v-navigation-drawer v-model="drawer" app>
			<v-list	>
				<v-list-tile to="/" nuxt>
					<v-list-tile-content>
						<v-list-tile-title>
							トップページ
						</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile to="/imas346/" nuxt>
					<v-list-tile-content>
						<v-list-tile-title>
							キャラクター
						</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar
			app
			dark
			dense
			color="cyan"
		>
			<v-toolbar-side-icon @click.stop="drawer = !drawer"/>
			<v-toolbar-title>
				<nuxt-link to="/" class="white--text">
					カップリングデータベース
				</nuxt-link>
			</v-toolbar-title>
		</v-toolbar>
		<v-content>
			<nuxt/>
		</v-content>
		<v-footer app>
			<v-flex text-xs-center xs12>
				このサイトは開発中です - <a
					href="https://github.com/hakatashi/coupling.moe"
					target="_blank">
					GitHub
				</a> - <a
					href="https://twitter.com/hakatashi"
					target="_blank">
					開発者Twitter
				</a>
			</v-flex>
		</v-footer>
	</v-app>
</template>

<script>
export default {
	data() {
		return {
			drawer: null,
		};
	},
};
</script>

<style>
@import "https://fonts.googleapis.com/icon?family=Material+Icons";
@font-face {
	font-family: coupling-font;
	src: url("/NotoSerifCJKjp-Black-subset.woff2") format("woff2"),
		url("/NotoSerifCJKjp-Black-subset.woff") format("woff");
}
.button--green {
	display: inline-block;
	border-radius: 4px;
	border: 1px solid #3b8070;
	color: #3b8070;
	background-color: white;
	outline: none;
	text-decoration: none;
	padding: 10px 30px;
}
.button--green[disabled] {
	color: dimgray;
	border-color: dimgray;
	background-color: lightgray;
}
.button--green:not([disabled]):hover {
	color: #fff;
	background-color: #3b8070;
}
.button--grey {
	display: inline-block;
	border-radius: 4px;
	border: 1px solid #35495e;
	color: #35495e;
	background-color: white;
	text-decoration: none;
	outline: none;
	padding: 10px 30px;
	margin-left: 15px;
}
.button--grey:hover {
	color: #fff;
	background-color: #35495e;
}
a {
	text-decoration: none;
}
</style>
