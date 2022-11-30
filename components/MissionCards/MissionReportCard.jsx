import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageSwap from "./ImageSwap";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useEffect, useState} from "react";
import {useUserContext} from "../../context/userContext";
import star1 from "../../assets/images/star_1.png";
import star2 from "../../assets/images/star_2.png";
import star3 from "../../assets/images/star_3.png";
import star4 from "../../assets/images/star_4.png";
import star5 from "../../assets/images/star_5.png";

export default function MissionReportCard({data, navigation, availableMissionData}) {
    const [hasVote, setHasVote] = useState(false);
    const [width, setWidth] = useState(60);
    const [username, setUsername] = useState("");
    const [percentage, setPercentage] = useState("...");
    const {user, getUserFromDb} = useUserContext()

    const computeVotePercentage = () => {
        const votes = data.votes
        let score = 0
        votes.map((vote) => {
            if (vote.mission_relevance) {
                score++
            }
        })
        const percentage =  Math.round((score/votes.length)*100)
        setWidth(120*(percentage/100))
        setPercentage(percentage.toString())
    }

    const getMissionById = (uid) => {
        let returnedMission
        availableMissionData.map((mission) => {
            if (mission.mission_uid === uid) {
                returnedMission = mission
            }
        })
        return returnedMission
    }

    const chooseStar = (difficulty) => {
        switch(difficulty) {
            case 1:
                return star1
            case 2:
                return star2
            case 3:
                return star3
            case 4:
                return star4
            case 5:
                return star5
            default:
                break
        }
    }

    useEffect(() => {
        computeVotePercentage()
        setHasVote(false)
        if (user) {
            data.votes.map((vote) => {
                if (vote.voter.includes(user.email)){
                    setHasVote(true)
                }
            })
        }
    }, [data.votes, user]);

    useEffect(() => {
        getUserFromDb(data?.reporter).then((res) => {
            res?.forEach((doc) => {
                setUsername(doc.data().username)
            })
        })
    }, []);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("MissionReportDetail", {missionData: data, hasVote})}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.upSide}>
                    <Text style={styles.title}>Rapport de mission</Text>
                    <Text style={styles.sideText}>@{username} · {data.created_at} mins</Text>
                </View>
                <View style={styles.downSide}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("AvailableMissionDetail", {
                            missionData: getMissionById(data.original_mission_uid),
                            star: chooseStar(getMissionById(data.original_mission_uid).difficulty),
                            readOnly: true
                        })}
                    >
                        <Text style={styles.locationText}>Mission original</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    position: "absolute",
                    width: 70,
                    height: 30,
                    backgroundColor: "white",
                    borderBottomWidth: 1,
                    borderRightWidth: 1,
                    borderColor: "red",
                    borderBottomRightRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 58,
                    zIndex: 99
                }}
            >
                <Text style={{color: "red", fontSize: 18, fontWeight: "bold"}}>Avant</Text>
            </View>
            <ImageSwap
                images={getMissionById(data.original_mission_uid).images}
                imageHeight={250}
                imageMarginTop={10}
                imageIndexMarginTop={80}
            />

            <View
                style={{
                    position: "absolute",
                    width: 70,
                    height: 30,
                    backgroundColor: "white",
                    borderBottomWidth: 1,
                    borderRightWidth: 1,
                    borderColor: "#25995C",
                    borderBottomRightRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 314,
                    zIndex: 99
                }}
            >
                <Text style={{color: "#25995C", fontSize: 18, fontWeight: "bold"}}>Après</Text>
            </View>

            <ImageSwap
                images={data.images}
                imageHeight={250}
                imageMarginTop={0}
                imageIndexMarginTop={340}
            />

            <View style={styles.bottomSide}>
                <View style={styles.commentBubble}>
                    <FontAwesome
                        name={"comment-o"}
                        size={30}
                        color={"black"}
                    />
                    <Text style={{marginLeft: 5, fontSize: 18, fontWeight: "bold"}}>{data.comments.length}</Text>
                </View>

                {data.reporter === !user?.uid && !hasVote ? (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "#25995C",
                            height: 40,
                            width: 30,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 20
                        }}
                    >
                        <MaterialCommunityIcons
                            name={"vote-outline"}
                            size={30}
                            color={"white"}
                        />
                    </View>
                ) : (
                    <View
                        style={{
                            flex: 1,
                            height: 40,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 20,
                            flexDirection: "row"
                        }}
                    >
                        <View
                            style={{
                                borderRadius: 20,
                                backgroundColor: (Number(percentage) >= 51 ? "#25995C" : "#bf2828"),
                                height: 40,
                                position: "absolute",
                                width: width,
                                zIndex: 98
                            }}
                        >
                        </View>
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 18,
                                color: "white",
                                position: "absolute",
                                zIndex: 99
                            }}
                        >
                            {percentage}%
                        </Text>
                        <View
                            style={{
                                borderRadius: 20,
                                backgroundColor:  (Number(percentage) >= 51 ? "#1b7746" : "#8f1e1e"),
                                height: 40,
                                paddingLeft: 120,
                            }}
                        >
                        </View>
                    </View>
                )}

                <View
                    style={{
                        flexDirection: "row",
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Ionicons
                        name={"share-outline"}
                        size={30}
                        color={"black"}
                    />
                    <Text style={{marginLeft: 5, fontSize: 18, fontWeight: "bold"}}>{data.shares.length}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        height: 640,
        width: "100%",
        backgroundColor: "white",
        marginTop: 3,
        borderWidth: 0.5,
        borderColor: "#959595"
    },
    header: {
        flexDirection: "column",
        marginTop: 8,
        marginLeft: 5
    },
    title: {
        fontWeight: "bold",
        fontSize: 18
    },
    sideText: {
        color: "#959595",
        fontSize: 11,
        marginLeft: 4,
        marginTop: 3
    },
    upSide: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    downSide: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 3
    },
    locationText: {
        color: "#25995C",
        fontWeight: "bold",
        fontSize: 13,
        marginLeft: 3,
        textDecorationLine: "underline"
    },
    bottomSide: {
        height: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    commentBubble: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})