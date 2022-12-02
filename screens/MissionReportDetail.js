import TopTab from "../components/TopTab";
import {ScrollView} from "react-native";
import BottomTab from "../components/BottomTab";
import AvailableMissionDetailPart from "../components/MissionDetail/AvailableMissionDetailPart";
import MissionReportDetailPart from "../components/MissionDetail/MissionReportDetailPart";
import SideMenu from "../components/SideMenu";
import {useState} from "react";


export default function MissionReportDetail({route, navigation}) {
    const {missionData, hasVote} = route.params
    const [displayMenu, setDisplayMenu] = useState(false);

    return (
        <>
            {displayMenu && (
                <SideMenu displayMenu={(state) => setDisplayMenu(state)} navigation={navigation}/>
            )}
            <TopTab navigation={navigation} displayMenu={(state) => setDisplayMenu(state)}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <MissionReportDetailPart missionData={missionData} hasVote={hasVote} navigation={navigation}/>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}