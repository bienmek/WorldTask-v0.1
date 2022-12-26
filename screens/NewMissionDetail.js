import TopTab from "../components/TopTab";
import NewMissionDetailPart from "../components/MissionDetail/NewMissionDetailPart";
import {SafeAreaView, ScrollView, StatusBar} from "react-native";
import BottomTab from "../components/BottomTab";
import SideMenu from "../components/SideMenu";
import {useRef, useState} from "react";


export default function NewMissionDetail({route, navigation}) {
    const [displayMenu, setDisplayMenu] = useState(false);
    const [update, setUpdate] = useState(0);
    const [commentTabPos, setCommentTabPos] = useState(0);
    const [callbackReplyTo, setCallbackReplyTo] = useState(null);
    const [scrollRef, setScrollRef] = useState(null);
    const [callbackCommentBubble, setCallbackCommentBubble] = useState(false);

    const {missionData, hasVote} = route.params

    return (
        <>
            {displayMenu && (
                <SideMenu displayMenu={(state) => setDisplayMenu(state)} navigation={navigation}/>
            )}
            <TopTab navigation={navigation} displayMenu={(state) => setDisplayMenu(state)}/>
            <NewMissionDetailPart
                missionData={missionData}
                hasVote={hasVote}
                navigation={navigation}
                callbackUpdate={update}
                commentTabPos={setCommentTabPos}
                callbackReplyTo={setCallbackReplyTo}
                cbScrollRef={setScrollRef}
                callbackCommentBubble={setCallbackCommentBubble}
                route={route}
            />
            <BottomTab
                navigation={navigation}
                newMissionData={missionData}
                callbackUpdate={setUpdate}
                update={update}
                scrollRef={scrollRef}
                commentTabPos={commentTabPos}
                callbackReplyTo={callbackReplyTo}
                callBackCommentBubble={callbackCommentBubble}
            />
        </>
    )
}