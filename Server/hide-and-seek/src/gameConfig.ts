export default {
	minPlayers: 1,
	maxPlayers: 8,
	preRoundCountdown: 5000,
	huntCountdown: 300000,
	initializeCountdown: 500,
	prologueCountdown: 5000,
	seekerCheckDistance: 7,
	// allowDebug: true,
	seekerGoal: `Your goal as Seeker is to capture all of the Hiders before time runs out.\nBe wary though, Hiders you have captured can be set free by their friends!`,
	hiderGoal: `Your goal as a Hider is to evade the Seeker until time runs out.\nBe careful, if the Seeker finds you, you'll be captured! If you are captured you can be set free by a fellow Hider, but if all Hiders are captured the Seeker wins!`,
};
