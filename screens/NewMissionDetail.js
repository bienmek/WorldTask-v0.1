import TopTab from "../components/TopTab";
import NewMissionDetailPart from "../components/MissionDetail/NewMissionDetailPart";
import {ScrollView} from "react-native";
import BottomTab from "../components/BottomTab";


export default function NewMissionDetail({route, navigation}) {
    const {missionData, hasVote} = route.params

    return (
        <>
            <TopTab navigation={navigation}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <NewMissionDetailPart missionData={missionData} hasVote={hasVote}/>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}