import {Text, View, StyleSheet, TouchableOpacity, Image} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageSwap from "../MissionCards/ImageSwap";
import {useEffect, useState} from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {useUserContext} from "../../context/userContext";
import CommentTab from "./CommentTab";
import {availableMissionData} from "../../firebase/mission-data-sample";
import star1 from "../../assets/images/star_1.png";
import star2 from "../../assets/images/star_2.png";
import star3 from "../../assets/images/star_3.png";
import star4 from "../../assets/images/star_4.png";
import star5 from "../../assets/images/star_5.png";


export default function MissionReportDetailPart({missionData, hasVote, navigation}) {
    const [profilePicture, setProfilePicture] = useState("https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/profile-picture%2Fblank_pp.png?alt=media&token=f3a7e038-17f6-47f4-a187-16cf7c188b05");
    const [username, setUsername] = useState("");
    const {getUserFromDb, user} = useUserContext()

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
        if (missionData?.reporter) {
            getUserFromDb(missionData.reporter).then((res) => {
                res?.forEach((doc) => {
                    console.log(doc.data())
                    setProfilePicture(doc.data().profilePicture)
                    setUsername(doc.data().username)
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
                        fontSize: 28,
                        marginLeft: 6
                    }}
                >
                    Rapport de mission
                </Text>

                <View style={styles.downSide}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("AvailableMissionDetail", {
                            missionData: getMissionById(missionData.original_mission_uid),
                            star: chooseStar(getMissionById(missionData.original_mission_uid).difficulty),
                            readOnly: true
                        }
                        )}
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
                    marginTop: 81,
                    zIndex: 99
                }}
            >
                <Text style={{color: "red", fontSize: 18, fontWeight: "bold"}}>Avant</Text>
            </View>
            <ImageSwap
                images={getMissionById(missionData.original_mission_uid).images}
                imageHeight={250}
                imageMarginTop={20}
                imageIndexMarginTop={90}
                navigation={navigation}
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
                    marginTop: 336,
                    zIndex: 99
                }}
            >
                <Text style={{color: "#25995C", fontSize: 18, fontWeight: "bold"}}>Après</Text>
            </View>

            <ImageSwap
                images={missionData.images}
                imageHeight={250}
                imageMarginTop={5}
                imageIndexMarginTop={345}
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
                <TouchableOpacity style={styles.userInfos} onPress={() => navigation.navigate("Profile", {routeUser: missionData?.reporter})}>
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
                        @{username}
                    </Text>
                </TouchableOpacity>
                <Text
                    style={{
                        color: "#959595",
                        fontSize: 13,
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

                {missionData.reporter === user?.uid ? (
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
                        onPress={() => navigation.navigate("MissionReportVotePage", {mission: missionData})}
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
            <CommentTab comments={missionData.comments} navigation={navigation}/>
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
        marginTop: 6,
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