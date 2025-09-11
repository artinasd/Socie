import pic1 from './assets/u(1).png'
import pic2 from './assets/u(2).png'
import pic3 from './assets/u(3).png'
import pic4 from './assets/u(4).png'
import pic5 from './assets/u(5).png'
import pic6 from './assets/u(6).png'
import story1 from './assets/st1.jpg'
import story2 from './assets/st2.jpg'
import story3 from './assets/st3.png'
import story4 from './assets/st4.jpg'
import story5 from './assets/st5.jpg'
import story6 from './assets/st6.jpg'
import feed1 from './assets/feed1.jpg'
import feed2 from './assets/feed2.jpg'

const USERS = [
    {
        'id': 1,
        'name': 'Olivia Thompson',
        'username': 'olivthpsn',
        'following': ['ethan_smith', 'soophy', 'micheal_br'],
        'follower': ['wdavis', 'ava_m', 'soophy'],
        'pic': pic1,
        'posts': {
            'feeds': [
                {'description': 'Just had the most amazing brunch with my bestie! 🍳🥞 We talked for hours and laughed so hard. Feeling so grateful for this friendship. 😊',
                    'media': feed1, 'stats': {'like': 0}}
            ],
            'stories': [story1]
        }
    },

    {
        'id': 2,
        'name': 'Ethan Smith',
        'username': 'ethan_smith',
        'following': [],
        'follower': [],
        'pic': pic2,
        'posts': {
            'feeds': [],
            'stories': [story2]
        }
    },

    {
        'id': 3,
        'name': 'Sophia Johnson',
        'username': 'soophy',
        'following': [],
        'follower': [],
        'pic': pic3,
        'posts': {
            'feeds': [],
            'stories': [story3]
        }
    },

    {
        'id': 4,
        'name': 'Michael Brown',
        'username': 'micheal_br',
        'following': [],
        'follower': [],
        'pic': pic4,
        'posts': {
            'feeds': [],
            'stories': [story4]
        }
    },

    {
        'id': 5,
        'name': 'Ava Miller',
        'username': 'ava_m',
        'following': [],
        'follower': [],
        'pic': pic5,
        'posts': {
            'feeds': [],
            'stories': [story5]
        }
    },

    {
        'id': 6,
        'name': 'William Davis',
        'username': 'wdavis',
        'following': [],
        'follower': [],
        'pic': pic6,
        'posts': {
            'feeds': [
                {'description': 'Taking a break from the hustle and bustle to enjoy some peace and quiet. 🧘‍♀️ This view never gets old. 🌅',
                    'media': feed2, 'stats': {'like': 2}}
            ],
            'stories': [story6]
        }
    },
]


export default USERS