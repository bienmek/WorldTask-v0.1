import {Text, View, StyleSheet, TouchableOpacity, Image, Dimensions} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageSwap from "../MissionCards/ImageSwap";
import {useEffect, useState} from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {useUserContext} from "../../context/userContext";
import CommentTab from "./CommentTab";
import star5 from "../../assets/images/star_5.png"

export default function AvailableMissionDetailPart({missionData, star, readOnly, navigation, route}) {
    const [profilePicture, setProfilePicture] = useState("https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/profile-picture%2Fblank_pp.png?alt=media&token=f3a7e038-17f6-47f4-a187-16cf7c188b05");
    const [username, setUsername] = useState("------");
    const {getUserFromDb, user} = useUserContext()
    const REWARD = 120

    useEffect(() => {
        getUserFromDb(missionData.creator).then((res) => {
            res?.forEach((doc) => {
                setProfilePicture(doc.data().profilePicture)
                setUsername(doc.data().username)
            })
        })
    }, [])

    const formatDate = () => {
        let submitDate
        if (missionData.creation_date !== null) {
            submitDate = new Date(missionData.creation_date.seconds*1000)
        } else {
            submitDate = new Date(Date.now())

        }
        return {localeDate: submitDate.toLocaleDateString(), hours: submitDate.getHours(), minutes: submitDate.getMinutes()}
    }

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

                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start"
                    }}
                >
                    <View style={styles.downSide}>
                        <Ionicons
                            name={"location-outline"}
                            size={20}
                            color={"black"}
                        />
                        <TouchableOpacity>
                            <Text style={styles.locationText}>{missionData.location.streetNumber} {missionData.location.streetName}, {missionData.location.city}</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Image
                            source={star}
                            style={{width: 50, height: 50}}
                        />
                    </View>
                </View>
            </View>

            <ImageSwap
                images={missionData.images}
                imageHeight={300}
                imageMarginTop={20}
                imageIndexMarginTop={30}
                navigation={navigation}
            />

            <View
                style={{
                    marginTop: 10,
                    backgroundColor: "white",
                    borderRadius: 20,
                    padding: 10,
                    width: "98%",
                    alignSelf: "center",
                    borderWidth: 2,
                    borderColor: "#25995C",
                    justifyContent: "center",
                    alignItems: "flex-start"
                }}
            >
                <Text
                    style={{
                        fontSize: 18,
                        textAlign: "left",
                        lineHeight: 28,
                        color: "black",
                    }}
                >
                    {missionData.description}
                </Text>
            </View>

            <View style={styles.bottomInfos}>
                <TouchableOpacity style={styles.userInfos} onPress={() => navigation.navigate("Profile", {routeUser: missionData.creator})}>
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
                        fontSize: 16,
                        marginLeft: 6,
                        marginTop: 10,
                        marginBottom: 10
                    }}
                >
                    {formatDate().localeDate} ⋅ {formatDate().hours}:{formatDate().minutes}
                </Text>
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

                {!readOnly ? (
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
                        <Text style={{color: "white", fontSize: 20}}>Choisir la task</Text>
                    </TouchableOpacity>
                ) : (
                    <></>
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

            {!readOnly && (
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20}}>
                    <Text style={{fontSize: 15, color: "#565656FF"}}>Estimation de la récompense: </Text>
                    <Text style={{fontSize: 18, color: "#565656FF", fontWeight: "bold"}}>~{REWARD}</Text>
                    <Image
                        source={star5}
                        style={{width: 25, height: 25}}
                    />
                </View>
            )}
            <CommentTab
                comments={
                    missionData.comments.sort((a, b) => {
                        const dateA = new Date(a.created_at);
                        const dateB = new Date(b.created_at);
                        return dateB - dateA;
                    })
                }
                navigation={navigation}
                route={route}
            />
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