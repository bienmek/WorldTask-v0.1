import {Text, View, StyleSheet, Image, TouchableOpacity, Dimensions} from "react-native";
import {useUserContext} from "../../context/userContext";
import {useEffect, useState} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../../firebase";
import Octicons from "react-native-vector-icons/Octicons";


export default function CommentCard({comment, replyTo, hasChild}) {
    const {getUserFromDb} = useUserContext()
    const [profilePicture, setProfilePicture] = useState("https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/profile-picture%2Fblank_pp.png?alt=media&token=f3a7e038-17f6-47f4-a187-16cf7c188b05");
    const [username, setUsername] = useState("");
    const [repliedAuthor, setRepliedAuthor] = useState("");

    useEffect(() => {
        if (comment?.author) {
            getUserFromDb(comment.author).then((res) => {
                res?.forEach((doc) => {
                    const user = doc.data()
                    setProfilePicture(user.profilePicture)
                    setUsername(user.username)
                })
            })
        }
        if (replyTo) {
            getUserFromDb(replyTo.author).then((res) => {
                res?.forEach((doc) => {
                    const user = doc.data()
                    setRepliedAuthor(user.username)
                })
            })
        }
    }, [])


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

                        <TouchableOpacity>
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
                    </View>

                    <TouchableOpacity style={{marginRight: 6}}>
                        <Octicons
                            name={"reply"}
                            size={30}
                            color={"black"}
                        />
                    </TouchableOpacity>
                </View>
                {replyTo && (
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 10
                        }}
                    >
                        <Text style={{color: "#959595", fontSize: 15}}>En réponse à</Text>
                        <TouchableOpacity>
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
                        {comment.comment}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text
                        style={{
                            color: "#959595",
                            fontSize: 11,
                        }}
                    >
                        {comment.created_at.split('-')[0]} · {comment.created_at.split('-')[1]}
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

