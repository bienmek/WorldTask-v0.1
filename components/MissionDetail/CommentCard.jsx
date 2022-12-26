import {Text, View, StyleSheet, Image, TouchableOpacity, Dimensions, Keyboard} from "react-native";
import {useUserContext} from "../../context/userContext";
import {useEffect, useState} from "react";
import Octicons from "react-native-vector-icons/Octicons";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../firebase";


export default function CommentCard({comment, replyTo, hasChild, navigation, callbackReplyTo, route}) {
    const {getUserFromDb} = useUserContext()
    const [profilePicture, setProfilePicture] = useState("https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/profile-picture%2Fblank_pp.png?alt=media&token=f3a7e038-17f6-47f4-a187-16cf7c188b05");
    const [username, setUsername] = useState("");
    const [repliedAuthor, setRepliedAuthor] = useState("");

    useEffect(() => {
        const retrieveUser = () => {
            const unsub1 = onSnapshot(doc(db, "taskers", comment.author), (snapshot) => {
                const user = snapshot.data()
                setProfilePicture(user.profilePicture)
                setUsername(user.username)
            })
            if (replyTo) {
                const unsub2 = onSnapshot(doc(db, "taskers", replyTo.author), (snapshot) => {
                    const user = snapshot.data()
                    setRepliedAuthor(user.username)
                })
                return () => {
                    unsub1()
                    unsub2()
                }
            }

            return () => {
                unsub1()
            }
        }

        retrieveUser()

    }, []);

    const formatDate = () => {
        const submitDate = new Date(comment.created_at)
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

    return (
        <View
            style={{
                width: "100%",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                backgroundColor: ((replyTo && hasChild) ? "#ececec" : "white"),
                borderTopWidth: 1,
                borderColor: "#95959595"
            }}
        >
            <View style={styles.commentContainer}>

                <View style={styles.header}>
                    <TouchableOpacity style={styles.userInfos} onPress={() => navigation.navigate("Profile", {routeUser: comment?.author})}>
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

                        <View>
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
                        </View>
                    </TouchableOpacity>

                    {route.name !== "AvailableMissionDetail" && (
                        <TouchableOpacity
                            style={{marginRight: 6}}
                            onPress={() => callbackReplyTo({comment: comment.uid, author: username})}
                        >
                            <Octicons
                                name={"reply"}
                                size={30}
                                color={"black"}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                {replyTo && (
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 10
                        }}
                    >
                        <Text style={{color: "#959595", fontSize: 15}}>En réponse à</Text>
                        <View>
                            <TouchableOpacity
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={{
                                        color: "#0066ff",
                                        textDecorationLine: "underline",
                                        marginLeft: 3,
                                        fontWeight: "bold",
                                        fontSize: 15
                                    }}
                                >
                                    @{repliedAuthor}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                <View
                    style={{
                        marginTop: 10,
                        width: "100%",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 15,
                            textAlign: "left",
                            lineHeight: 28,
                            color: "black"
                        }}
                    >
                        {comment?.comment}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text
                        style={{
                            color: "#959595",
                            fontSize: 11,
                        }}
                    >
                        Il y a {formatDate()}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: ("white"),
        borderTopWidth: 1,
        borderColor: "#95959595",

    },
    userInfos: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    commentContainer: {
        marginLeft: 6,
        marginTop: 10,
        marginRight: 6,
        marginBottom: 10
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },
    footer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10
    }
})

