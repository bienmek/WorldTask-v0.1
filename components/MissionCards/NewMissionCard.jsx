import {Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import {useFonts} from "expo-font";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageSwap from "./ImageSwap";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useEffect, useState} from "react";
import {useUserContext} from "../../context/userContext";

export default function NewMissionCard({data, navigation}) {
    const [hasVote, setHasVote] = useState(false);
    const [width, setWidth] = useState(60);
    const [percentage, setPercentage] = useState("...");
    const {user, getUserFromDb} = useUserContext()
    const [username, setUsername] = useState("------");

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

    useEffect(() => {
        if (data?.creator_uid) {
            getUserFromDb(data?.creator_uid).then((res) => {
                res?.forEach((doc) => {
                    const user = doc.data()
                    setUsername(user.username)
                })
            })
        }
    }, [data,])

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


    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("NewMissionDetail", {missionData: data, hasVote})}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.upSide}>
                    <Text style={styles.title}>{data.title}</Text>
                    <Text style={styles.sideText}>@{username} · {data.created_at} mins</Text>
                </View>
                <View style={styles.downSide}>
                    <Ionicons
                        name={"location-outline"}
                        size={20}
                        color={"black"}
                    />
                    <TouchableOpacity>
                        <Text style={styles.locationText}>{data.location}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ImageSwap
                images={data.images}
                imageHeight={300}
                imageMarginTop={10}
                imageIndexMarginTop={80}
                navigation={navigation}
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

                {data.creator_uid !== user?.uid && !hasVote ? (
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
        height: 400,
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