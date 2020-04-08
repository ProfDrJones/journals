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

<template>
	<ul class="timeline">
		<TimelineItem
			v-for="item in timeline"
			:id="item.id"
			:key="item.id"
			:item="item" />
	</ul>
</template>

<script>
import TimelineItem from './Timeline/TimelineItem'

export default {
	components: {
		TimelineItem,
	},
	data: () => ({
		timeline: [
			{
				id: 5,
				icon_class: 'glyphicon glyphicon-comment',
				icon_status: '',
				title: 'Admin added a comment.',
				created: '24. Sep 17:03',
				body: '<p><i>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam, maxime alias nam dignissimos natus voluptate iure deleniti. Doloremque, perspiciatis voluptas dignissimos ex, ullam et, reprehenderit similique possimus iste commodi minima fugiat non culpa, veniam temporibus laborum. Distinctio ipsam cupiditate debitis aliquid deleniti consectetur voluptates corporis officiis tempora minus veniam, accusamus cum optio nesciunt illo nulla odio? Quidem nesciunt, omnis at quo aliquam porro amet fugit mollitia minus explicabo, possimus deserunt rem ut commodi laboriosam quia. Numquam, est facilis rem iste voluptatum. Cupiditate porro fuga saepe quis nulla mollitia, magni dicta soluta distinctio tempore voluptate quo perferendis. Maiores eveniet deleniti, nemo.</i></p>',
			},
			{
				id: 4,
				icon_class: 'glyphicon glyphicon-edit',
				icon_status: 'success',
				title: 'Started editing',
				controls: [],
				created: '24. Sep 14:48',
				body: 'Today was a beautiful, bright and sunny day so I decided to build a boat! I needed to get some long, hard wood so I travelled to the forest to collect a huge pile. After I had gathered some wood, I began to nail the pieces together using my flint hammer and dinosaur teeth for nails. It took 2 hours to build, but once it was finished I was very proud of myself. Was it going to float?',
			},
			{
				id: 3,
				icon_class: 'glyphicon glyphicon-hand-right',
				icon_status: 'warning',
				title: 'Message delegated',
				controls: [],
				created: '23. Sep 11:12',
				body: '<p>This message has been delegated.</p>',
			},
			{
				id: 2,
				icon_class: 'glyphicon glyphicon-map-marker',
				icon_status: 'danger',
				title: 'Message approved and forwarded',
				controls: [],
				created: '20. Sep 15:56',
				body: '<p>Message has been approved and forwarded to responsible.</p>',
			},
			{
				id: 1,
				icon_class: 'glyphicon glyphicon-map-marker',
				icon_status: '',
				title: 'Message forwarded for approval',
				controls: [],
				created: '19. Sep 19:49',
				body: '<p>Message has been forwarded for approval.</p>',
			},
		],
	}),
}
</script>
