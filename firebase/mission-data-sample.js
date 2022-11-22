const data = {
    title: "Déchets sur la plage",
    creator: "superLuigi666",
    created_at: 2,
    location: "Le mourillon, Toulon",
    images: [
        "https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/missions-data%2Fdechets_plage1.jpg?alt=media&token=24e50c71-bcd2-4412-b8aa-026f0bc016a6",
        "https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/missions-data%2Fdechets_plage2.jpg?alt=media&token=1bd8c9ba-ba6e-4262-aed4-5dfd3dd0b15b",
        "https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/missions-data%2Fdechets_plage3.jpg?alt=media&token=e1d73cfc-612c-4e68-bd97-68f75f005a72",
        "https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/missions-data%2Fdechets_plage4.jpg?alt=media&token=631005ff-b1e5-4b3d-822a-94c34b429e66",
        "https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/missions-data%2FSchumpeter.jpg?alt=media&token=2d55339d-a706-442a-a52a-1a81362472fa"
    ],
    comments: [
        {
            commenter: "superWario666",
            comment: "Super mission, très bien rédigée et très clair ! Je Upvote !",
            created_at: 3,
            answered_to: null
        },
        {
            commenter: "superLuigi666",
            comment: "Salut, non je pense que la mission est très clair !",
            created_at: 3,
            answered_to: 3 //Comment ID
        },
        {
            commenter: "superMario666",
            comment: "Très bonne mission j’aimerais bien la faire dès qu’elle sera disponible, j’habite à coté en plus ! Cependant je trouve qu’il manque de photo parce qu’on ne dirait pas trop le mourillon. Et je trouve aussi que ça manque d’outils recommandé. Je upvote quand même mais il faudrait que tu me précise tout ça en réponse !",
            created_at: 3,
            answered_to: null
        }
    ],
    shares: [
        "superMario666",
        "superWario666"
    ],
    votes: [
        {
            voter: "superMario666",
            mission_relevance: false,
            mission_difficulty: 3
        },
        {
            voter: "ugooo.krollak@gmail.com",
            mission_relevance: false,
            mission_difficulty: 4
        },
        {
            voter: "xxxxxxxx",
            mission_relevance: false,
            mission_difficulty: 3
        },
        {
            voter: "xxxxxxx",
            mission_relevance: true,
            mission_difficulty: 5
        },{
            voter: "xxxxxxxxxxxx",
            mission_relevance: true,
            mission_difficulty: 1
        },
        {
            voter: "xxxxxxxxxxxxxxxxx",
            mission_relevance: true,
            mission_difficulty: 5
        },
        {
            voter: "xxxxxxxxxxxxxxxxx",
            mission_relevance: true,
            mission_difficulty: 5
        },
        {
            voter: "xxxxxxxxxxxxxxxxx",
            mission_relevance: true,
            mission_difficulty: 5
        },
        {
            voter: "xxxxxxxxxxxxxxxxx",
            mission_relevance: true,
            mission_difficulty: 5
        },
        {
            voter: "xxxxxxxxxxxxxxxxx",
            mission_relevance: true,
            mission_difficulty: 5
        },
        {
            voter: "xxxxxxxxxxxxxxxxx",
            mission_relevance: true,
            mission_difficulty: 5
        },

    ]
}

export default data