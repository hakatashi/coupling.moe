<template>
	<v-app>
		<v-navigation-drawer app>
			<v-list	>
				<v-list-tile>
					<v-list-tile-content>
						<v-list-tile-title>
							<nuxt-link to="/">
								トップページ
							</nuxt-link>
						</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile>
					<v-list-tile-content>
						<v-list-tile-title>
							<nuxt-link to="/characters">
								キャラクター
							</nuxt-link>
						</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar app dark color="cyan">
			<v-toolbar-side-icon></v-toolbar-side-icon>
			<v-toolbar-title>
				<nuxt-link to="/" class="white--text">
					カップリングデータベース
				</nuxt-link>
			</v-toolbar-title>
		</v-toolbar>
		<v-content>
			<v-container fluid>
				<nuxt/>
			</v-container>
		</v-content>
		<v-footer app></v-footer>
	</v-app>
</template>

<style>
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
