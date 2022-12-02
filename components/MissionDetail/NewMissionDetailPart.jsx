import {Text, View, StyleSheet, TouchableOpacity, Image} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageSwap from "../MissionCards/ImageSwap";
import {useEffect, useState} from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {useUserContext} from "../../context/userContext";
import CommentTab from "./CommentTab";


export default function NewMissionDetailPart({missionData, hasVote, navigation}) {
    const [profilePicture, setProfilePicture] = useState("https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/profile-picture%2Fblank_pp.png?alt=media&token=f3a7e038-17f6-47f4-a187-16cf7c188b05");
    const {getUserFromDb, user} = useUserContext()

    useEffect(() => {
        if (missionData?.creator_uid) {
            getUserFromDb(missionData.creator_uid).then((res) => {
                res?.forEach((doc) => {
                    console.log(doc.data())
                    setProfilePicture(doc.data().profilePicture)
                })
            })
        }
    }, [])
    return (
        <View style={styles.main}>
            <View styles={styles.missionInfos}>
                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 30,
                        marginLeft: 6
                    }}
                >
                    {missionData.title}
                </Text>

                <View style={styles.downSide}>
                    <Ionicons
                        name={"location-outline"}
                        size={20}
                        color={"black"}
                    />
                    <TouchableOpacity>
                        <Text style={styles.locationText}>{missionData.location}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ImageSwap
                images={missionData.images}
                imageHeight={300}
                imageMarginTop={20}
                imageIndexMarginTop={100}
                navigation={navigation}
            />

            <Text
                style={{
                    fontSize: 18,
                    textAlign: "left",
                    marginBottom: 10,
                    marginLeft: 6,
                    marginRight: 6,
                    lineHeight: 28,
                    color: "black",
                    marginTop: 10
                }}
            >
                {missionData.description}
            </Text>

            <View style={styles.bottomInfos}>
                <View style={styles.userInfos}>
                    <Image
                        source={{uri: profilePicture}}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 100,
                            marginRight: 5,
                            resizeMode: "contain"
                        }}
                    />
                    <Text
                        style={{
                            color: "#25995C",
                            fontWeight: "bold",
                            fontSize: 22,
                            marginLeft: 3
                        }}
                    >
                        @{missionData.creator_username}
                    </Text>
                </View>
                <Text
                    style={{
                        color: "#959595",
                        fontSize: 16,
                        marginLeft: 6,
                        marginTop: 10,
                        marginBottom: 10
                    }}
                >{missionData.precise_date} · {missionData.precise_hour}</Text>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20
                }}
            >
                <View style={styles.commentBubble}>
                    <FontAwesome
                        name={"comment-o"}
                        size={30}
                        color={"black"}
                    />
                    <Text style={{marginLeft: 5, fontSize: 18, fontWeight: "bold"}}>{missionData.comments.length}</Text>
                </View>

                {missionData.creator_uid === user?.uid ? (
                    <TouchableOpacity
                        style={{
                            flex: 2,
                            backgroundColor: "#25995C",
                            height: 40,
                            width: 30,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 20
                        }}
                    >
                        <Text style={{color: "white", fontWeight: "bold", fontSize: 22}}>Modifier</Text>
                    </TouchableOpacity>
                ) : !hasVote ? (
                    <TouchableOpacity
                        style={{
                            flex: 2,
                            backgroundColor: "#25995C",
                            height: 40,
                            width: 30,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 20
                        }}
                        onPress={() => navigation.navigate("NewMissionVotePage", {mission: missionData})}
                    >
                        <Text style={{color: "white", fontWeight: "bold", fontSize: 22}}>Voter</Text>
                    </TouchableOpacity>
                ) : (
                    <View
                        style={{
                            flex: 2,
                            backgroundColor: "#25995C",
                            height: 40,
                            width: 30,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 20
                        }}
                    >
                        <Text style={{color: "white", fontWeight: "bold", fontSize: 22}}>Vous avez voté</Text>
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
                    <Text style={{marginLeft: 5, fontSize: 18, fontWeight: "bold"}}>{missionData.shares.length}</Text>
                </View>
            </View>
            <CommentTab comments={missionData.comments} />
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        marginTop: 10,
    },
    missionInfos: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    downSide: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 3,
        marginLeft: 6
    },
    locationText: {
        color: "#25995C",
        fontWeight: "bold",
        fontSize: 18,
        marginLeft: 3,
        textDecorationLine: "underline"
    },
    bottomInfos: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor: "#959595"
    },
    userInfos: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginLeft: 6
    },
    commentBubble: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})