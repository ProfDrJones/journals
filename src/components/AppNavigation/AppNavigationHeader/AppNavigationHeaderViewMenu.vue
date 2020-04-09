<!--
  - @copyright Copyright (c) 2019 Georg Ehrke <oc.list@georgehrke.com>
  - @author Georg Ehrke <oc.list@georgehrke.com>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template>
	<Actions :default-icon="defaultIcon" menu-align="right">
		<ActionButton
			v-for="view in views"
			:key="view.id"
			:icon="view.icon"
			@click="selectView(view.id)">
			{{ view.label }}
		</ActionButton>
	</Actions>
</template>

<script>
import Actions from '@nextcloud/vue/dist/Components/Actions'
import ActionButton from '@nextcloud/vue/dist/Components/ActionButton'

export default {
	name: 'AppNavigationHeaderViewMenu',
	components: {
		Actions,
		ActionButton,
	},
	computed: {
		views() {
			return [{
				id: 'TimelineView',
				icon: 'icon-view-timeline',
				label: this.$t('journals', 'Timeline View'),
			}, {
				id: 'JournalView',
				icon: 'icon-view-journal',
				label: this.$t('journals', 'Journal View'),
			}, {
				id: 'CalendarView',
				icon: 'icon-view-calendar',
				label: this.$t('journals', 'Calendar View'),
			}]
		},
		defaultIcon() {
			for (const view of this.views) {
				if (view.id === this.$route.name) {
					return view.icon
				}
			}

			return 'icon-toggle-pictures'
		},
	},
	methods: {
		selectView(viewName) {
			const name = viewName
			const params = Object.assign({}, this.$route.params)

			// Don't push new route when view didn't change
			if (this.$route.name === viewName) {
				return
			}

			this.$router.push({ name, params })
		},
	},
}
</script>
