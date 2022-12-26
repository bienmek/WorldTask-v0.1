import {ActivityIndicator, Dimensions, Image, Keyboard, Text, TextInput, TouchableOpacity, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import createTaskOutlined from "../assets/images/createtask-outlined.png"
import createTaskBlack from "../assets/images/pencil_ruler.png"
import {useRoute} from "@react-navigation/native";
import {isIphoneX} from "react-native-iphone-x-helper";
import {useEffect, useRef, useState} from "react";
import {arrayUnion, doc, onSnapshot, serverTimestamp, updateDoc} from "firebase/firestore";
import {db} from "../firebase";
import {useUserContext} from "../context/userContext";


export default function BottomTab({navigation, newMissionData, callbackUpdate, update, commentTabPos, scrollRef, callbackReplyTo, callBackCommentBubble}) {
    const [additionalHeight, setAdditionalHeight] = useState(0);
    const [inputHeight, setInputHeight] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [stateReply, setStateReply] = useState(null);

    const SCREEN_HEIGHT = Dimensions.get('window').height;
    const OFFSET = 20
    const MAX_COMMENT_LENGTH = 350

    const route = useRoute()

    const inputRef = useRef(null)

    const {user} = useUserContext()

    useEffect(() => {
        console.log(callbackReplyTo)
        if (callbackReplyTo) {
            inputRef.current.focus()
            setStateReply(callbackReplyTo)
        }
        if(callBackCommentBubble) {
            inputRef.current.focus()
        }
        Keyboard.addListener('keyboardWillShow', (event) => {
            const keyboardHeight = event.endCoordinates.height
            const ratio = keyboardHeight/SCREEN_HEIGHT
            setAdditionalHeight(SCREEN_HEIGHT*ratio)
        })
        Keyboard.addListener('keyboardWillHide', () => {
            setAdditionalHeight(0)
            setStateReply(null)
        })


    }, [Keyboard, callbackReplyTo, callBackCommentBubble])

    const computeTabHeight = () => {
        const IPHONE_X_OFFSET = 70
        const INPUT_KEYBOARD_OFFSET = 20

        if (route.name === "NewMissionDetail" && !additionalHeight) {
            return isIphoneX() ? 50 + IPHONE_X_OFFSET : 100
        } else if (route.name === "NewMissionDetail" && additionalHeight) {
            return loading && stateReply ? additionalHeight + inputHeight + INPUT_KEYBOARD_OFFSET + 100 :
                loading && !stateReply ? additionalHeight + inputHeight + INPUT_KEYBOARD_OFFSET + 50 :
                !loading && stateReply ? additionalHeight + inputHeight + INPUT_KEYBOARD_OFFSET + 50 :
                additionalHeight + inputHeight + INPUT_KEYBOARD_OFFSET
        } else {
            return isIphoneX() ? IPHONE_X_OFFSET : 50
        }
    }

    const generateUUID = () => { // Public Domain/MIT
        let d = new Date().getTime();//Timestamp
        let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    const postComment = async () => {
        setLoading(true)
        if (comment.length <= 0) {
            return
        }
        const missionRef = doc(db, "new_tasks", newMissionData.uid);
        const newCommentUid = generateUUID()
        const newComment = {
            uid: newCommentUid,
            author: user.uid,
            comment: comment.length > MAX_COMMENT_LENGTH ? comment.substring(0, MAX_COMMENT_LENGTH).replace(/\s{2,}/g, ' ') : comment.replace(/\s{2,}/g, ' '),
            created_at: Date.now(),
            replies: [],
            isReply: !!stateReply
        }
        if (stateReply) {
            await updateDoc(missionRef, {comments: arrayUnion(newComment)})
            onSnapshot(missionRef, async (doc) => {
                const comments = doc.data().comments
                const repliesAtIndex = comments[comments.findIndex((item) => item.uid === stateReply.comment)].replies
                if (!repliesAtIndex.includes(newCommentUid)) {
                    repliesAtIndex.push(newCommentUid)
                    comments[comments.findIndex((item) => item.uid === stateReply.comment)].replies = repliesAtIndex
                    await updateDoc(missionRef, {comments: comments})
                }
            });
        } else {
            await updateDoc(missionRef, {comments: arrayUnion(newComment)})
        }

        setComment('')
        setLoading(false)
        setAdditionalHeight(0)
        Keyboard.dismiss()
        if (!stateReply) {
            scrollRef.current.scrollTo({y: commentTabPos, animated: true})
        }
        callbackUpdate(update+1)
    }

    return (
        <View
            style={{
                height: computeTabHeight(),
                width: "100%",
                borderTopWidth: 0.5,
                borderColor: "#959595",
                flexDirection: "column",
                justifyContent: "flex-end",
            }}
        >
            {stateReply !== null && (
                <View
                    style={{
                        position: "absolute",
                        top: loading ? 50 : 0,
                        height: 50,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18
                        }}
                    >
                        En réponse à {" "}
                        <Text style={{ color: "#0066ff", textDecorationLine: "underline", fontWeight: "bold"}}>
                            @{stateReply.author}
                        </Text>
                    </Text>
                </View>
            )}

            {loading && (
                <View
                    style={{
                        position: "absolute",
                        top:0,
                        height: 50,
                        width: "100%",
                        marginTop: 5
                    }}
                >
                    <ActivityIndicator size="large" color="#959595" />
                </View>
            )}

            {route.name === "NewMissionDetail" && (

                <View
                    style={{
                        top:
                            additionalHeight && stateReply && !loading ? 55 :
                            additionalHeight && !stateReply && !loading ? 5 :
                            additionalHeight && stateReply && loading ? 105 :
                            additionalHeight && !stateReply && loading  ? 55 : 0,
                        position: "absolute",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        height: additionalHeight ? 150 : 50,
                        width: "100%",
                    }}
                    onLayout={(event) => {
                        const height = event.nativeEvent.layout.height
                        if ((additionalHeight + inputHeight + OFFSET) <= 0.7*SCREEN_HEIGHT) {
                            setInputHeight(height)
                        }
                    }}
                >
                    <TextInput
                        placeholder={"Donnez votre avis, demandez des informations, débattez, ..."}
                        style={{
                            backgroundColor: "white",
                            borderColor: (MAX_COMMENT_LENGTH - comment.length) < 0 ? "red" : "#959595",
                            borderWidth: 1,
                            borderRadius: 20,
                            paddingVertical: 15,
                            paddingHorizontal: 15,
                            width: additionalHeight ? "80%" : "98%",
                            fontSize: 15,
                            height: additionalHeight ? 150 : 40,
                        }}
                        keyboardType={"twitter"}
                        multiline={true}
                        onLayout={(event) => {
                            const height = event.nativeEvent.layout.height
                            if ((additionalHeight + inputHeight + OFFSET) <= 0.7*SCREEN_HEIGHT) {
                                setInputHeight(height)
                            }
                        }}
                        onChangeText={(arg) => {
                            setComment(arg)
                        }}
                        value={comment}
                        ref={inputRef}
                    />

                    {!!additionalHeight && (
                        <View
                            style={{
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%"
                            }}
                        >
                            <TouchableOpacity
                                style={{marginLeft: 5}}
                                onPress={postComment}
                            >
                                <Ionicons
                                    name={"send"}
                                    size={30}
                                    color={"#25995C"}
                                />
                            </TouchableOpacity>
                            {additionalHeight !== 0 && (
                                <Text
                                    style={{
                                        position: "absolute",
                                        alignItems: "center",
                                        bottom: 10,
                                        color: (MAX_COMMENT_LENGTH - comment.length) > 20 ? "#25995C" : (MAX_COMMENT_LENGTH - comment.length) < 0 ? "red" : "#d9890f"
                                    }}
                                >
                                    {MAX_COMMENT_LENGTH - comment.length}
                                </Text>
                            )}
                        </View>
                    )}
            </View>
            )}

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    height: isIphoneX() ? 70 : 50,
                    width: "100%",
                }}
            >
                <TouchableOpacity
                    style={{marginLeft: 10, marginTop: 5}}
                    onPress={() =>  navigation.navigate("Home")}
                >
                    <Ionicons
                        name={(
                            route.name === "MakeAnAction" ||
                            route.name === "CreateTask" ||
                            route.name === "Notifications") ? "home-outline" : "home"}
                        size={30}
                        color={"black"}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("MakeAnAction")} style={{marginTop: 5}}>
                    <Image
                        source={(route.name === "MakeAnAction" || route.name === "CreateTask") ? createTaskBlack : createTaskOutlined}
                        style={{height: 30, width: 30}}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={{marginRight: 10, marginTop: 5}} onPress={() => navigation.navigate("Notifications")}>
                    <Ionicons
                        name={route.name === "Notifications" ? "notifications" : "notifications-outline"}
                        size={30}
                        color={"black"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}