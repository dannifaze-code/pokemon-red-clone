// ============================================
// STORY SYSTEM — Echoes of the Fallen Champion
// ============================================

const GAME_TITLE = 'Echoes of the Fallen Champion';
const PLAYER_NAME = 'KAI';
const REGION_NAME = 'Veltara';

// ============================================
// INTRO SEQUENCE — Plays at story progress 0
// ============================================
const INTRO_SEQUENCE = [
    '...',
    'Five years.',
    'Five years since the night everything ended.',
    'The arena. The screaming. LUMINAREX out of control.',
    'They said it was your fault.',
    'You believed them.',
    '...',
    'FERNVALE. A forgotten town at the edge of VELTARA.',
    'Nobody here knows your face.',
    'That\'s why you came.',
    '...',
    'PROF. SOLEN: I know who you are.',
    'PROF. SOLEN: Don\'t worry. Your secret is safe with me.',
    'PROF. SOLEN: But KAI... you can\'t hide forever.',
    'PROF. SOLEN: Something is happening in this region.',
    'PROF. SOLEN: Creatures are going missing. People are scared.',
    'PROF. SOLEN: THE VEIL is moving again.',
    '...',
    'KAI: THE VEIL...',
    'PROF. SOLEN: You know something. I can see it.',
    'PROF. SOLEN: Whatever happened that night — it wasn\'t an accident, was it?',
    '...',
    'PROF. SOLEN: Take this. It\'s not much.',
    'PROF. SOLEN: But every journey starts somewhere.',
    'PROF. SOLEN: Start small. Get strong. Find the truth.',
    '...',
    'Your journey begins in FERNVALE.',
    'You are KAI. Once a champion. Now a ghost.',
    'It\'s time to become something again.'
];

// ============================================
// NPC DIALOG DATABASE
// Keyed by npcId, then by storyProgress range
// Each entry: { minProgress, maxProgress, dialog[] }
// ============================================
const NPC_DIALOG = {

    professor: [
        {
            minProgress: 0, maxProgress: 0,
            dialog: [
                'PROF. SOLEN: You\'re still here. Good.',
                'PROF. SOLEN: The VEIL has been spotted north of town.',
                'PROF. SOLEN: Be careful out there, KAI.'
            ]
        },
        {
            minProgress: 1, maxProgress: 2,
            dialog: [
                'PROF. SOLEN: That young trainer, DRAY — he\'s talented.',
                'PROF. SOLEN: Reminds me of someone I used to know.',
                'PROF. SOLEN: Don\'t let your pride get in the way of that battle.'
            ]
        },
        {
            minProgress: 3, maxProgress: 3,
            dialog: [
                'PROF. SOLEN: You drove the VEIL out of MOSSGROVE.',
                'PROF. SOLEN: They called you by name, didn\'t they.',
                'PROF. SOLEN: That means MIRA knows you\'re back.',
                'PROF. SOLEN: KAI... whatever you remember next — trust it.'
            ]
        },
        {
            minProgress: 4, maxProgress: 5,
            dialog: [
                'PROF. SOLEN: I knew the truth would find you eventually.',
                'PROF. SOLEN: You were set up. LUMINAREX was poisoned.',
                'PROF. SOLEN: The VEIL needed a scapegoat and a weapon.',
                'PROF. SOLEN: You gave them both without knowing.'
            ]
        },
        {
            minProgress: 6, maxProgress: 7,
            dialog: [
                'PROF. SOLEN: DRAY has come a long way.',
                'PROF. SOLEN: He\'s angry. But he\'s here. That matters.',
                'PROF. SOLEN: The Summit is dangerous, KAI.',
                'PROF. SOLEN: MIRA will be expecting you.'
            ]
        },
        {
            minProgress: 8, maxProgress: 9,
            dialog: [
                'PROF. SOLEN: LUMINAREX is free. You did it.',
                'PROF. SOLEN: The region will know the truth now.',
                'PROF. SOLEN: You don\'t need the championship back, KAI.',
                'PROF. SOLEN: You never needed the title. You just needed to know.'
            ]
        }
    ],

    rival_dray: [
        {
            minProgress: 0, maxProgress: 1,
            dialog: [
                'DRAY: You\'re new here.',
                'DRAY: Fernvale doesn\'t get travellers.',
                'DRAY: Whatever you\'re running from — keep it to yourself.'
            ]
        },
        {
            minProgress: 2, maxProgress: 2,
            dialog: [
                'DRAY: You think you\'re ready to challenge me?',
                'DRAY: Fine. Let\'s see what you\'ve got.',
                'DRAY: Don\'t embarrass yourself.',
                '[DRAY wants to battle!]'
            ]
        },
        {
            minProgress: 3, maxProgress: 3,
            dialog: [
                'DRAY: Not bad. For a wanderer.',
                'DRAY: You handled those VEIL grunts too.',
                'DRAY: I\'m watching you.'
            ]
        },
        {
            minProgress: 4, maxProgress: 4,
            dialog: [
                'DRAY: I looked you up.',
                'DRAY: KAI. The Champion who destroyed the arena.',
                'DRAY: I used to have a poster of you on my wall.',
                'DRAY: I burned it.',
                'DRAY: Prove to me you\'re not what they said you were.',
                '[DRAY wants to battle — for real this time!]'
            ]
        },
        {
            minProgress: 5, maxProgress: 6,
            dialog: [
                'DRAY: You\'re not what I expected.',
                'DRAY: Still annoying. But... not what they said.',
                'DRAY: I\'m going to the Summit too.',
                'DRAY: Don\'t tell me not to come. I\'m coming.'
            ]
        },
        {
            minProgress: 7, maxProgress: 8,
            dialog: [
                'DRAY: We\'re doing this together.',
                'DRAY: LUMINAREX deserves to be free.',
                'DRAY: And MIRA deserves to answer for what she did.',
                'DRAY: Let\'s go.'
            ]
        },
        {
            minProgress: 9, maxProgress: 9,
            dialog: [
                'DRAY: So what do you do now? Reclaim the championship?',
                'DRAY: ...',
                'DRAY: You\'re not going to, are you.',
                'DRAY: Then let me ask you something.',
                'DRAY: Will you train me?',
                'DRAY: I want to become a champion worth looking up to.'
            ]
        }
    ],

    veil_grunt: [
        {
            minProgress: 0, maxProgress: 2,
            dialog: [
                'VEIL GRUNT: Move along. Nothing here concerns you.',
                'VEIL GRUNT: THE VEIL\'s business is none of yours.'
            ]
        },
        {
            minProgress: 3, maxProgress: 3,
            dialog: [
                'VEIL GRUNT: Wait...',
                'VEIL GRUNT: Those eyes. That stance.',
                'VEIL GRUNT: You\'re... you\'re the Champion.',
                'VEIL GRUNT: MIRA said you were dead.',
                'VEIL GRUNT: I— I have to report this!',
                '[VEIL GRUNT fled!]'
            ]
        },
        {
            minProgress: 4, maxProgress: 5,
            dialog: [
                'VEIL GRUNT: MIRA knows you\'re back.',
                'VEIL GRUNT: She says to give you a message.',
                'VEIL GRUNT: "Stop digging. Or we finish what we started."',
                '[VEIL GRUNT wants to battle!]'
            ]
        },
        {
            minProgress: 6, maxProgress: 7,
            dialog: [
                'VEIL GRUNT: You\'ve gone too far!',
                'VEIL GRUNT: MIRA will end this herself.',
                '[VEIL GRUNT wants to battle!]'
            ]
        }
    ],

    veil_commander: [
        {
            minProgress: 6, maxProgress: 7,
            dialog: [
                'COMMANDER VOSS: KAI. Impressive.',
                'COMMANDER VOSS: You made it further than MIRA expected.',
                'COMMANDER VOSS: LUMINAREX\'s power has been... extraordinary.',
                'COMMANDER VOSS: Shame you\'ll never see it again.',
                '[COMMANDER VOSS wants to battle!]'
            ]
        },
        {
            minProgress: 8, maxProgress: 9,
            dialog: [
                'COMMANDER VOSS: It\'s over.',
                'COMMANDER VOSS: MIRA is gone. THE VEIL is finished.',
                'COMMANDER VOSS: ...',
                'COMMANDER VOSS: For what it\'s worth — I\'m sorry.',
                'COMMANDER VOSS: Some of us didn\'t know the full plan.'
            ]
        }
    ],

    mira: [
        {
            minProgress: 8, maxProgress: 8,
            dialog: [
                'MIRA: So you finally made it.',
                'MIRA: Five years of hiding. And here you are.',
                'MIRA: You want to know why.',
                'MIRA: Because you were in the way.',
                'MIRA: LUMINAREX was the most powerful creature in VELTARA.',
                'MIRA: And it was WASTED on a child with a hero complex.',
                'MIRA: We gave it to a cause worth something.',
                'KAI: You call this a cause?',
                'MIRA: I call it progress.',
                'MIRA: You\'ll understand. After you lose. Again.',
                '[MIRA, Leader of THE VEIL, wants to battle!]'
            ]
        },
        {
            minProgress: 9, maxProgress: 9,
            dialog: [
                'MIRA: ...',
                'MIRA: Congratulations.',
                'MIRA: You won your little battle.',
                'MIRA: But you can\'t win what\'s already been set in motion.',
                'KAI: It\'s over, MIRA.',
                'MIRA: ...',
                'MIRA: Maybe it is.',
                '[MIRA was defeated. THE VEIL disbanded.]'
            ]
        }
    ],

    townsperson_1: [
        {
            minProgress: 0, maxProgress: 1,
            dialog: [
                'VILLAGER: Oh! A stranger.',
                'VILLAGER: We don\'t get many visitors here in FERNVALE.',
                'VILLAGER: It\'s a quiet town. We like it that way.'
            ]
        },
        {
            minProgress: 2, maxProgress: 3,
            dialog: [
                'VILLAGER: Those people in the dark coats have been around lately.',
                'VILLAGER: They say they\'re doing "research".',
                'VILLAGER: But my FLUFFWING went missing last week...'
            ]
        },
        {
            minProgress: 4, maxProgress: 6,
            dialog: [
                'VILLAGER: You drove them out of MOSSGROVE!',
                'VILLAGER: I don\'t know who you are, stranger.',
                'VILLAGER: But thank you.'
            ]
        },
        {
            minProgress: 7, maxProgress: 9,
            dialog: [
                'VILLAGER: The whole region is talking about what happened at the Summit.',
                'VILLAGER: THE VEIL is gone. LUMINAREX is free.',
                'VILLAGER: And the Champion... KAI... they were innocent all along.',
                'VILLAGER: It\'s like something out of a story.'
            ]
        }
    ],

    townsperson_2: [
        {
            minProgress: 0, maxProgress: 2,
            dialog: [
                'OLD TRAINER: Back in my day, we walked uphill both ways to find wild creatures.',
                'OLD TRAINER: You look like a trainer. Strong eyes.',
                'OLD TRAINER: The MOSSGROVE to the north is good for training.',
                'OLD TRAINER: Watch out for THE VEIL. They\'ve been lurking there.'
            ]
        },
        {
            minProgress: 3, maxProgress: 5,
            dialog: [
                'OLD TRAINER: You took on THE VEIL in the MOSSGROVE.',
                'OLD TRAINER: Ha! They didn\'t know what hit them.',
                'OLD TRAINER: You\'ve got champion-level grit, kid.',
                'OLD TRAINER: Almost reminds me of someone...'
            ]
        },
        {
            minProgress: 6, maxProgress: 9,
            dialog: [
                'OLD TRAINER: I knew it.',
                'OLD TRAINER: The moment I saw you, I thought — that\'s KAI.',
                'OLD TRAINER: I watched every one of your championship battles.',
                'OLD TRAINER: Welcome back. We missed you.'
            ]
        }
    ],

    sign_fernvale: [
        {
            minProgress: 0, maxProgress: 9,
            dialog: [
                'FERNVALE TOWN',
                'Population: 40',
                '"A small town with a long memory."',
                'PROF. SOLEN\'S RESEARCH LAB →'
            ]
        }
    ],

    sign_mossgrove: [
        {
            minProgress: 0, maxProgress: 9,
            dialog: [
                'MOSSGROVE FOREST — AHEAD',
                'Warning: Wild creatures are active.',
                'Recent disturbances reported.',
                'Travel with caution.'
            ]
        }
    ],

    sign_dustway: [
        {
            minProgress: 0, maxProgress: 9,
            dialog: [
                'DUSTWAY ROUTE',
                'Tall grass ahead — watch your step.',
                'MOSSGROVE FOREST lies to the north.',
                'FERNVALE TOWN lies to the south.'
            ]
        }
    ],

    sign_mirefall: [
        {
            minProgress: 0, maxProgress: 9,
            dialog: [
                'MIREFALL TOWN',
                'Population: 120',
                '"Built on the edge of the marsh."',
                'GYM LEADER: SYLVA'
            ]
        }
    ],

    sign_thornway: [
        {
            minProgress: 0, maxProgress: 9,
            dialog: [
                'THORNWAY RIDGE',
                'Narrow mountain pass ahead.',
                'Strong creatures reported in the cliffs.',
                'Proceed with caution.'
            ]
        }
    ],

    sign_cinderholm: [
        {
            minProgress: 0, maxProgress: 9,
            dialog: [
                'CINDERHOLM CITY',
                'Population: 800',
                '"The forge of the north."',
                'GYM LEADER: CINDER'
            ]
        }
    ],

    sign_ashfall: [
        {
            minProgress: 0, maxProgress: 9,
            dialog: [
                'ASHFALL PASS',
                'Volcanic activity detected.',
                'Do not approach lava fissures.',
                'VELTARA SUMMIT — beyond this pass.'
            ]
        }
    ],

    sign_summit: [
        {
            minProgress: 0, maxProgress: 9,
            dialog: [
                'VELTARA SUMMIT',
                'Restricted area.',
                'All travellers enter at their own risk.',
                '...'
            ]
        }
    ],

    // ── Gym Leaders ───────────────────────────────────────
    gym_brix: [
        {
            minProgress: 0, maxProgress: 9,
            dialog: [
                'BRIX: So, a challenger walks into my gym.',
                'BRIX: The name\'s BRIX. Leader of the FERNVALE GYM.',
                'BRIX: Normal-type creatures, sure. But nothing about this battle will be normal.',
                'BRIX: Show me what you\'ve got!'
            ]
        }
    ],

    gym_sylva: [
        {
            minProgress: 0, maxProgress: 2,
            dialog: [
                'SYLVA: A fresh face from the south.',
                'SYLVA: MIREFALL is a quiet town. We like it that way.',
                'SYLVA: But the VEIL has been unsettling the marsh creatures.',
                'SYLVA: If you want my badge, you\'ll have to earn it.',
                'SYLVA: Prove you can handle what\'s coming.'
            ]
        },
        {
            minProgress: 3, maxProgress: 9,
            dialog: [
                'SYLVA: You\'ve been pushing back against the VEIL.',
                'SYLVA: I\'ve heard the stories.',
                'SYLVA: The marsh respects strength and patience both.',
                'SYLVA: Let\'s see which you have.'
            ]
        }
    ],

    gym_cinder: [
        {
            minProgress: 0, maxProgress: 4,
            dialog: [
                'CINDER: CINDERHOLM wasn\'t built for the faint of heart.',
                'CINDER: And neither were my creatures.',
                'CINDER: The VEIL thinks they own this city.',
                'CINDER: They\'re wrong. And so is anyone who isn\'t ready for fire.',
                'CINDER: Come. Let\'s find out if you\'re the real thing.'
            ]
        },
        {
            minProgress: 5, maxProgress: 9,
            dialog: [
                'CINDER: Word travels fast in CINDERHOLM.',
                'CINDER: They say you\'re KAI. The fallen champion.',
                'CINDER: I don\'t care about the past. I care about right now.',
                'CINDER: Prove to me you still burn.'
            ]
        }
    ],

    // ── Route & World NPCs ────────────────────────────────
    route_trainer_1: [
        {
            minProgress: 0, maxProgress: 9,
            dialog: [
                'HIKER RUDO: Hold on, traveller!',
                'HIKER RUDO: I\'ve been patrolling this route for weeks.',
                'HIKER RUDO: Something\'s wrong in MOSSGROVE. Creatures acting strange.',
                'HIKER RUDO: My team and I are keeping watch. Stay sharp.'
            ]
        }
    ],

    veil_patrol: [
        {
            minProgress: 0, maxProgress: 2,
            dialog: [
                'VEIL GRUNT: Halt! This forest belongs to THE VEIL.',
                'VEIL GRUNT: Turn back now or face the consequences.',
                '[VEIL GRUNT wants to battle!]'
            ]
        },
        {
            minProgress: 3, maxProgress: 9,
            dialog: [
                'VEIL GRUNT: ...You again.',
                'VEIL GRUNT: You\'ve cost us everything in this forest.',
                'VEIL GRUNT: Commander VOSS will hear about this.'
            ]
        }
    ],

    townsperson_3: [
        {
            minProgress: 0, maxProgress: 3,
            dialog: [
                'FISHER: MIREFALL used to be peaceful.',
                'FISHER: Now THE VEIL has men on the docks at night.',
                'FISHER: I don\'t dare cast a line after dark anymore.'
            ]
        },
        {
            minProgress: 4, maxProgress: 9,
            dialog: [
                'FISHER: Things have been quieter since you arrived.',
                'FISHER: The VEIL pulled back from the docks.',
                'FISHER: I don\'t know who you are, but thank you.'
            ]
        }
    ],

    townsperson_4: [
        {
            minProgress: 0, maxProgress: 5,
            dialog: [
                'WORKER: CINDERHOLM runs on fire and iron.',
                'WORKER: The forge has been cold for weeks — the VEIL controls the fuel supply.',
                'WORKER: If someone could cut off their operation up north...',
                'WORKER: ...the whole city would owe them one.'
            ]
        },
        {
            minProgress: 6, maxProgress: 9,
            dialog: [
                'WORKER: The forge is running again!',
                'WORKER: I heard it was you who broke the VEIL\'s hold on the pass.',
                'WORKER: CINDERHOLM won\'t forget this.'
            ]
        }
    ],

    veil_grunt: [
        {
            minProgress: 0, maxProgress: 3,
            dialog: [
                'VEIL GRUNT: You shouldn\'t be here.',
                'VEIL GRUNT: THE VEIL will reclaim this region.',
                'VEIL GRUNT: Commander VOSS has plans for MIREFALL.',
                '[VEIL GRUNT wants to battle!]'
            ]
        },
        {
            minProgress: 4, maxProgress: 9,
            dialog: [
                'VEIL GRUNT: ...Commander VOSS has abandoned this post.',
                'VEIL GRUNT: I don\'t even know why I\'m still here.',
                'VEIL GRUNT: Just... leave me alone.'
            ]
        }
    ],

    veil_commander: [
        {
            minProgress: 0, maxProgress: 4,
            dialog: [
                'VEIL COMMANDER: So you\'re the one causing disruptions.',
                'VEIL COMMANDER: Impressive, for a nobody.',
                'VEIL COMMANDER: But MIRA\'s plan is already in motion.',
                'VEIL COMMANDER: You\'re too late.',
                '[COMMANDER wants to battle!]'
            ]
        },
        {
            minProgress: 5, maxProgress: 9,
            dialog: [
                'VEIL COMMANDER: ...MIRA underestimated you.',
                'VEIL COMMANDER: I won\'t make that mistake.',
                'VEIL COMMANDER: This isn\'t over.'
            ]
        }
    ],

    mira: [
        {
            minProgress: 0, maxProgress: 7,
            dialog: [
                'MIRA: ...',
                'MIRA: You finally came.',
                'MIRA: I wondered how long it would take.',
                'MIRA: Do you even know what you\'re fighting for, KAI?',
                'MIRA: Or are you still running from what happened?'
            ]
        },
        {
            minProgress: 8, maxProgress: 9,
            dialog: [
                'MIRA: You\'ve earned this moment.',
                'MIRA: I\'ve been waiting for a challenger worthy of the truth.',
                'MIRA: Everything ends here, KAI.',
                'MIRA: Let\'s finish this.',
                '[MIRA wants to battle!]'
            ]
        }
    ]
};

// ============================================
// GYM LEADERS
// ============================================
const GYM_LEADERS = {
    gym_brix: {
        name: 'BRIX',
        title: 'Fernvale Gym Leader',
        type: 'normal',
        badge: 'Stone Badge',
        party: [
            { species: 'SCRATCHCLAW', level: 9 },
            { species: 'SKYWING',     level: 10 }
        ]
    },
    gym_sylva: {
        name: 'SYLVA',
        title: 'Mirefall Gym Leader',
        type: 'grass',
        badge: 'Marsh Badge',
        party: [
            { species: 'SILKWORM',     level: 20 },
            { species: 'LEAFLING',     level: 22 },
            { species: 'GROVEGUARDIAN', level: 24 }
        ]
    },
    gym_cinder: {
        name: 'CINDER',
        title: 'Cinderholm Gym Leader',
        type: 'fire',
        badge: 'Ember Badge',
        party: [
            { species: 'EMBERL',      level: 35 },
            { species: 'BLAZECLAW',   level: 38 },
            { species: 'INFERNOBEAST', level: 42 }
        ]
    }
};

// ============================================
// STORY EVENT FLAGS
// Events that trigger when storyProgress changes
// ============================================
const STORY_EVENTS = {
    0: {
        description: 'The Return — Kai arrives in Fernvale',
        starterPool: ['LEAFLING', 'EMBERL', 'AQUAFIN'],
        items: [{ id: 'POKE_BALL', count: 5 }, { id: 'POTION', count: 3 }]
    },
    2: {
        description: 'DRAY challenges Kai for the first time',
        rivalBattle: {
            name: 'DRAY',
            party: [{ species: 'SCRATCHCLAW', level: 8 }]
        }
    },
    3: {
        description: 'VEIL grunts encountered in Mossgrove',
        veilBattle: {
            name: 'VEIL GRUNT',
            party: [{ species: 'SKYWING', level: 10 }]
        }
    },
    4: {
        description: 'Memory fragment — the truth surfaces',
        memoryDialog: [
            '[ MEMORY FRAGMENT ]',
            'The night of the championship...',
            'A needle. A dark corridor. Someone in a VEIL coat.',
            'LUMINAREX\'s cry — not rage. Pain.',
            '...',
            'It wasn\'t your fault.',
            'It was never your fault.'
        ]
    },
    5: {
        description: 'DRAY confronts Kai about true identity',
        rivalBattle: {
            name: 'DRAY',
            party: [
                { species: 'SCRATCHCLAW', level: 16 },
                { species: 'SKYWING', level: 14 }
            ]
        }
    },
    8: {
        description: 'Final confrontation with MIRA',
        finalBattle: {
            name: 'MIRA',
            party: [
                { species: 'FANGSTRIKER', level: 36 },
                { species: 'VOLTAJOLT', level: 38 },
                { species: 'INFERNOBEAST', level: 42 }
            ]
        }
    },
    9: {
        description: 'Redemption — Kai passes the torch to DRAY',
        endingDialog: [
            '[ EPILOGUE ]',
            'The truth spread through VELTARA like sunlight after a storm.',
            'THE VEIL disbanded. MIRA faced justice.',
            'LUMINAREX was free.',
            '...',
            'KAI stood at the edge of FERNVALE.',
            'The championship was there — waiting to be reclaimed.',
            '...',
            'KAI: No.',
            'KAI: That title belongs to someone who still has something to prove.',
            '...',
            'DRAY: ...You\'re serious.',
            'KAI: Go earn it.',
            'KAI: I\'ll be watching.',
            '...',
            'Some champions are remembered for their victories.',
            'KAI would be remembered for something harder.',
            'For coming back.',
            '...',
            'THE END',
            'Thank you for playing ECHOES OF THE FALLEN CHAMPION.'
        ]
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getDialog(npcId, storyProgress) {
    const npcEntries = NPC_DIALOG[npcId];
    if (!npcEntries) return ['...'];

    // Find the most specific dialog entry for current progress
    for (let i = npcEntries.length - 1; i >= 0; i--) {
        const entry = npcEntries[i];
        if (storyProgress >= entry.minProgress && storyProgress <= entry.maxProgress) {
            return entry.dialog;
        }
    }

    // Fallback to first entry
    return npcEntries[0].dialog;
}

function getStoryEvent(progress) {
    return STORY_EVENTS[progress] || null;
}

function getMemoryDialog(progress) {
    const event = STORY_EVENTS[progress];
    return event?.memoryDialog || null;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GAME_TITLE, PLAYER_NAME, REGION_NAME,
        INTRO_SEQUENCE, NPC_DIALOG, STORY_EVENTS, GYM_LEADERS,
        getDialog, getStoryEvent, getMemoryDialog
    };
}
