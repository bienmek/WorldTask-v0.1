import {Text, View} from "react-native";
import CommentCard from "./CommentCard";
import {useState} from "react";
import AntDesign from "react-native-vector-icons/AntDesign";


export default function CommentTab({comments}) {

    const getTargetedComment = (commentId) => {
        let returnedComment
        if (commentId) {
            comments.map((comment) => {
                if (comment.comment_uid === commentId) {
                    returnedComment = comment
                }
            })
            return returnedComment
        }
        return null
    }

    const getCommentChildren = (parentComment) => {
        const children = []
        comments.map((comment) => {
            if (comment.reply_to === parentComment.comment_uid) {
                children.push(comment)
            }
        })
        return children
    }

    // 1 commentaire -> si enfants (réponses) -> ajoute les réponses en tant que ses enfants -> les afficher par date

    return (
        <View style={{marginTop: 25}}>
            {comments.map((comment, index) => {
                const children = getCommentChildren(comment)
                if (children.length > 0) {
                    return (
                        <>
                            <View key={index} >
                                <CommentCard comment={comment} replyTo={getTargetedComment(comment.reply_to)} />
                                <View style={{backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
                                    <AntDesign
                                        name={"arrowdown"}
                                        size={30}
                                        color={"black"}
                                    />
                                </View>
                            </View>
                            {children.map((childComment, index2) => (
                                    <CommentCard
                                        comment={childComment}
                                        key={index2}
                                        replyTo={getTargetedComment(childComment.reply_to)}
                                        hasChild={getCommentChildren(childComment)}
                                    />
                                )
                            )}
                        </>
                    )
                } else if (!comment.reply_to) {
                    return (
                        <CommentCard comment={comment} key={index}/>
                    )
                }
            })
            }
        </View>
    )
}