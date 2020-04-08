<!--
Nextcloud - Journals

@author Johannes Szeibert

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
License as published by the Free Software Foundation; either
version 3 of the License, or any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU AFFERO GENERAL PUBLIC LICENSE for more details.

You should have received a copy of the GNU Affero General Public
License along with this library.  If not, see <http://www.gnu.org/licenses/>.

-->

<template id="timeline-item-template">
	<li class="timeline-item">
		<div class="timeline-badge"
			:class="item.icon_status">
			<i :class="item.icon_class" />
		</div>
		<div class="timeline-panel">
			<div class="timeline-heading">
				<h4 class="timeline-title">
					{{ item.title }}
				</h4>
				<div class="timeline-panel-controls">
					<div class="timestamp">
						<small class="text-muted">{{ item.created }}</small>
					</div>
				</div>
			</div>
			<div class="timeline-body">
				{{ item.body }}
			</div>
		</div>
	</li>
</template>

<script>
export default {
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
}
</script>
