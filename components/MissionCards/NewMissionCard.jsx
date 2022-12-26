import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
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
        if (votes.length > 0) {
            let score = 0
            votes.map((vote) => {
                if (vote.mission_relevance) {
                    score++
                }
            })
            const percentage =  Math.round((score/votes.length)*100)
            console.log(percentage)
            setWidth(120*(percentage/100))
            setPercentage(percentage.toString())
        } else {
            setWidth(120)
            setPercentage("Pas de vote")
        }
    }

    const formatDate = () => {
        let submitDate
        if (data.creation_date !== null) {
            submitDate = new Date(data.creation_date.seconds*1000)
        } else {
            submitDate = new Date(Date.now())

        }
        const now = new Date(Date.now())
        const diffTime = now.getTime() - submitDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

        if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) {
            return `${diffSeconds} s`
        }
        if (diffDays === 0 && diffHours === 0 && diffMinutes === 1) {
            return `${diffMinutes} min`
        }
        if (diffDays === 0 && diffHours === 0 && diffMinutes > 1) {
            return `${diffMinutes} mins`
        }
        if (diffDays === 0 && diffHours >= 1) {
            return `${diffHours} h`
        }
        if (diffDays >= 1) {
            return `${diffDays} j`
        }
    }

    useEffect(() => {
        computeVotePercentage()

        getUserFromDb(data.creator)
            .then((res) => {
                res?.forEach((doc) => {
                    const user = doc.data()
                    setUsername(user.username)
                })
        })

        if (data.votes.some((item) => item.voter === user.uid)) {
            setHasVote(true)
        }
    }, [data])


    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("NewMissionDetail", {missionData: data, hasVote})}
            activeOpacity={0.7}
        >
            <View
                style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    width: "100%",
                    padding: 5,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "100%",
                        flexWrap: "wrap"
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 18,
                        }}
                    >
                        {data.title}
                    </Text>
                    <Text
                        style={{
                            color: "#959595",
                            fontSize: 11,
                            marginLeft: 4,
                            marginTop: 3,
                            textAlign: "center"
                        }}
                    >
                        @{username} · {formatDate()}
                    </Text>
                </View>
                <View style={styles.downSide}>
                    <Ionicons
                        name={"location-outline"}
                        size={20}
                        color={"black"}
                    />
                    <TouchableOpacity>
                        <Text style={styles.locationText}>{data.location.streetNumber} {data.location.streetName}, {data.location.city}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ImageSwap
                images={data.images}
                imageHeight={300}
                imageMarginTop={10}
                imageIndexMarginTop={20}
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

                {(data.creator !== user?.uid) && !hasVote ? (
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
                            {data.votes.length > 0 ? (
                                <>
                                    {percentage}%
                                </>
                            ) : (
                                <>{percentage}</>
                            )}

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
        fontSize: 18,
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