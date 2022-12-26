import {Dimensions, Keyboard, Text, TouchableOpacity, View} from "react-native";
import CommentCard from "./CommentCard";
import {useEffect, useState} from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../../firebase";


export default function CommentTab({comments, navigation, commentTabPos, callbackReplyTo, scrollRef, update, route}) {
    const [showReplies, setShowReplies] = useState([]);

    useEffect(() => {
        setShowReplies([])
    }, [update])

    const getTargetedComment = (commentId) => {
        return comments[comments.findIndex((item) => item.uid === commentId)]
    }

    const countReplies = (comment, start = 0) => {
        comment.replies.map((reply) => {
            if (getTargetedComment(reply).replies.length > 0) {
                start += countReplies(getTargetedComment(reply), start++)+1
            } else {
                start++
            }
        })
        return start
    }

    const displayReplies = (comment) => {
        return (
            <>
                {comment.replies.map((reply, index) => (
                    <View
                        key={index}
                        style={{
                            // borderBottomWidth: reply === comment.replies[comment.replies.length - 1] ? 2: 0,
                            // borderColor: "#25995C",
                            // zIndex: 10
                        }}
                    >
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#ececec"
                            }}
                            onLayout={() => {
                                setShowReplies((prevState) => [...prevState, {uid: getTargetedComment(reply).uid, showReply: false}])
                            }}
                        >
                            <CommentCard
                                comment={getTargetedComment(reply)}
                                navigation={navigation}
                                callbackReplyTo={callbackReplyTo}
                                scrollRef={scrollRef}
                                replyTo={comment}
                                hasChild={true}
                                route={route}
                            />
                            {getTargetedComment(reply)?.replies.length > 0 && (
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%"
                                    }}
                                    onPress={() => {
                                        const updatedItem = [...showReplies]
                                        updatedItem[showReplies.findIndex((item) => item.uid === getTargetedComment(reply).uid)].showReply = !updatedItem[showReplies.findIndex((item) => item.uid === getTargetedComment(reply).uid)].showReply
                                        setShowReplies(updatedItem)
                                    }}
                                >
                                    {showReplies[showReplies.findIndex((item) => item.uid === getTargetedComment(reply).uid)]?.showReply ? (
                                        <AntDesign
                                            name={"arrowup"}
                                            size={30}
                                            color={"black"}
                                        />
                                    ) : (
                                        <>
                                            <AntDesign
                                                name={"arrowdown"}
                                                size={30}
                                                color={"black"}
                                            />
                                            <View
                                                style={{
                                                    transform: [{translateX: 40}],
                                                    position: "absolute",
                                                    backgroundColor: "#dadada",
                                                    paddingVertical: 2,
                                                    paddingHorizontal: 10,
                                                    borderRadius: 100,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    opacity: 0.85
                                                }}
                                            >
                                                <Text style={{fontSize: 15}}>
                                                    {getTargetedComment(reply).replies.length}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                        {showReplies[showReplies.findIndex((item) => item.uid === getTargetedComment(reply)?.uid)]?.showReply && (
                            <>
                                {getTargetedComment(reply)?.replies.length > 0 && displayReplies(getTargetedComment(reply))}
                            </>
                        )}
                    </View>
                ))}
            </>
        )
    }

    return (
        <View
            style={{
                marginTop: 20
            }}
            onLayout={(event) => {
                if (route.name !== "AvailableMissionDetail") {
                    const {y} = event.nativeEvent.layout
                    console.log("Comment tab pos:", y)
                    commentTabPos(y)
                }
            }}

        >
            {comments.map((comment, index) => (
                <View
                    key={index}
                >
                    {!comment.isReply && (
                        <>
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "white",
                                    width: "100%"
                                }}
                                onLayout={() => {
                                    setShowReplies((prevState) => [...prevState, {uid: comment.uid, showReply: false}])
                                }}
                            >
                                <CommentCard
                                    comment={comment}
                                    navigation={navigation}
                                    callbackReplyTo={callbackReplyTo}
                                    scrollRef={scrollRef}
                                    key={index}
                                    route={route}
                                />
                                {comment?.replies.length > 0 && (
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "100%"
                                        }}
                                        onPress={() => {
                                            const updatedItem = [...showReplies]
                                            updatedItem[showReplies.findIndex((item) => item.uid === comment.uid)].showReply = !updatedItem[showReplies.findIndex((item) => item.uid === comment.uid)].showReply
                                            setShowReplies(updatedItem)
                                        }}
                                    >
                                        {showReplies[showReplies.findIndex((item) => item.uid === comment.uid)]?.showReply ? (
                                            <AntDesign
                                                name={"arrowup"}
                                                size={30}
                                                color={"black"}
                                            />
                                            ) : (
                                                <>
                                                    <AntDesign
                                                        name={"arrowdown"}
                                                        size={30}
                                                        color={"black"}
                                                    />
                                                    <View
                                                         style={{
                                                             transform: [{translateX: 40}],
                                                             position: "absolute",
                                                             backgroundColor: "#dadada",
                                                             paddingVertical: 2,
                                                             paddingHorizontal: 10,
                                                             borderRadius: 100,
                                                             justifyContent: "center",
                                                             alignItems: "center",
                                                             opacity: 0.85
                                                         }}
                                                    >
                                                        <Text style={{fontSize: 15}}>
                                                             {countReplies(comment)}
                                                         </Text>
                                                    </View>
                                                </>
                                        )}

                                    </TouchableOpacity>
                                )}
                            </View>

                            {showReplies[showReplies.findIndex((item) => item.uid === comment.uid)]?.showReply && (
                                <>
                                    {comment?.replies.length > 0 && displayReplies(comment)}
                                </>
                            )}
                        </>
                    )}
                </View>
            ))}


        </View>
    )
}