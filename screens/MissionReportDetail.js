import TopTab from "../components/TopTab";
import {ScrollView} from "react-native";
import BottomTab from "../components/BottomTab";
import AvailableMissionDetailPart from "../components/MissionDetail/AvailableMissionDetailPart";
import MissionReportDetailPart from "../components/MissionDetail/MissionReportDetailPart";


export default function MissionReportDetail({route, navigation}) {
    const {missionData, hasVote} = route.params

    return (
        <>
            <TopTab navigation={navigation}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <MissionReportDetailPart missionData={missionData} hasVote={hasVote} navigation={navigation}/>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}