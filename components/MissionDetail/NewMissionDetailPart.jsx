import {ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageSwap from "../MissionCards/ImageSwap";
import {useEffect, useRef, useState} from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {useUserContext} from "../../context/userContext";
import CommentTab from "./CommentTab";
import {collection, getDocs, limit, orderBy, query, onSnapshot, doc, where} from "firebase/firestore";
import {db} from "../../firebase";
import Loading from "../Loading";
import Octicons from "react-native-vector-icons/Octicons";


export default function NewMissionDetailPart({missionData, hasVote, navigation, callbackUpdate, commentTabPos, callbackReplyTo, cbScrollRef, callbackCommentBubble, route}) {
    const [profilePicture, setProfilePicture] = useState("https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/profile-picture%2Fblank_pp.png?alt=media&token=f3a7e038-17f6-47f4-a187-16cf7c188b05");
    const [username, setUsername] = useState("------");
    const {getUserFromDb, user} = useUserContext()
    const [loadedMissionData, setLoadedMissionData] = useState(missionData);

    const [scrollUpdate, setScrollUpdate] = useState(0);

    const [topLoading, setTopLoading] = useState(false);

    const [updateCommentTab, setUpdateCommentTab] = useState(0);

    const scrollRef = useRef(null)
    const scrollPositionTop = useRef(0)

    const reloadMissionData = () => {
        setTopLoading(true)
        onSnapshot(doc(db, "new_tasks", missionData.uid), (doc) => {
            setLoadedMissionData(doc.data())
            setTopLoading(false)
        });
    }

    useEffect(() => {
        reloadMissionData()
        cbScrollRef(scrollRef)

        getUserFromDb(loadedMissionData.creator).then((res) => {
            res?.forEach((doc) => {
                setProfilePicture(doc.data().profilePicture)
                setUsername(doc.data().username)
            })
        })
    }, [scrollUpdate, callbackUpdate])

    const delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }


    const formatDate = () => {
        let submitDate
        if (loadedMissionData.creation_date !== null) {
            submitDate = new Date(loadedMissionData.creation_date.seconds*1000)
        } else {
            submitDate = new Date(Date.now())

        }
        return {localeDate: submitDate.toLocaleDateString(), hours: submitDate.getHours(), minutes: submitDate.getMinutes()}
    }

    const handleScrollEndDrag = (event) => {
        const currentScrollPosition = event.nativeEvent.contentOffset.y;

        if (currentScrollPosition <= 0) {
            const scrollDifference = currentScrollPosition - scrollPositionTop.current;
            if (Math.abs(scrollDifference) > 50 && !topLoading) {
                setScrollUpdate(scrollUpdate+1)
            }
        }
        scrollPositionTop.current = currentScrollPosition;
    };
    //
    // const handleScrollBottom = (event) => {
    //     const currentScrollPosition = event.nativeEvent.contentOffset.y;
    //     const totalHeight = event.nativeEvent.contentSize.height;
    //
    //     // Calculate the current scroll percentage
    //     const scrollPercentage = currentScrollPosition / totalHeight;
    //     console.log(scrollPercentage)
    //     if (scrollPercentage > 0.8 && !bottomLoading && !loading) {
    //         setBottomLoading(true)
    //         const q = query(collection(db, "comments"), orderBy("created_at", "desc"), limit(contentLimit))
    //         getDocs(q)
    //             .then((querySnapshot) => {
    //                 querySnapshot.forEach((doc) => {
    //                     if (!comments.some((item) => item.uid === doc.id)) {
    //                             setComments((prevState) => [...prevState, doc.data()])
    //                         }
    //                 })
    //             })
    //             .finally(() => {
    //                 setBottomLoading(false)
    //                 setContentLimit(contentLimit+5)
    //             })
    //     }
    // }

    if (loadedMissionData)
    return (
        <ScrollView
            scrollEventThrottle={500}
            //onScroll={handleScrollBottom}
            ref={scrollRef}
            onScrollEndDrag={handleScrollEndDrag}
        >
            {topLoading && (
                <View style={{marginTop: 20, marginBottom: 20}}>
                    <ActivityIndicator size="large" color="#959595" />
                </View>
            )}
            <View styles={styles.missionInfos}>
                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 30,
                        marginLeft: 6
                    }}
                >
                    {loadedMissionData.title}
                </Text>

                <View style={styles.downSide}>
                    <Ionicons
                        name={"location-outline"}
                        size={20}
                        color={"black"}
                    />
                    <TouchableOpacity>
                        <Text style={styles.locationText}>{loadedMissionData.location.streetNumber} {loadedMissionData.location.streetName}, {loadedMissionData.location.city}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ImageSwap
                images={loadedMissionData.images}
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
                    {loadedMissionData.description}
                </Text>
            </View>

            {loadedMissionData.hasBeenModified && (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginTop: 20,
                        marginBottom: 20,
                        left: 10
                    }}
                >
                    <Octicons
                        name={"pencil"}
                        size={25}
                        color={"#959595"}
                    />

                    <Text
                        style={{
                            color: "#959595",
                            fontSize: 15,
                            fontStyle: "italic",
                            marginLeft: 10
                        }}
                    >
                        Cette task a été modifié.
                    </Text>
                </View>
            )}


            <View style={styles.bottomInfos}>
                <TouchableOpacity style={styles.userInfos} onPress={() => navigation.navigate("Profile", {routeUser: loadedMissionData.creator})}>
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
                <TouchableOpacity
                    style={styles.commentBubble}
                    onPress={() => callbackCommentBubble(Date.now())}
                >
                    <FontAwesome
                        name={"comment-o"}
                        size={30}
                        color={"black"}
                    />
                    <Text style={{marginLeft: 5, fontSize: 18, fontWeight: "bold"}}>{loadedMissionData.comments.length}</Text>
                </TouchableOpacity>

                {(loadedMissionData.creator === user?.uid) ? (
                    <>
                        {loadedMissionData.hasBeenModified ? (
                            <></>
                        ) : (
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
                                onPress={() => navigation.navigate("ModifyTask", {routeTask: loadedMissionData})}
                            >
                                <Text style={{color: "white", fontSize: 22}}>Modifier</Text>
                            </TouchableOpacity>
                        )}
                    </>

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
                        onPress={() => navigation.navigate("NewMissionVotePage", {mission: loadedMissionData})}
                    >
                        <Text style={{color: "white", fontSize: 22}}>Voter</Text>
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
                        <Text style={{color: "white", fontSize: 22}}>Vous avez voté</Text>
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
                    <Text style={{marginLeft: 5, fontSize: 18, fontWeight: "bold"}}>{loadedMissionData.shares.length}</Text>
                </View>
            </View>
            <CommentTab
                comments={
                loadedMissionData.comments.sort((a, b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    return dateB - dateA;
                })
            }
                navigation={navigation}
                commentTabPos={commentTabPos}
                callbackReplyTo={callbackReplyTo}
                scrollRef={scrollRef}
                update={updateCommentTab}
                route={route}
            />
        </ScrollView>
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
        marginTop: 5,
        marginLeft: 6,
        marginBottom: 20
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