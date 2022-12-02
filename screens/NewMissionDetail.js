import TopTab from "../components/TopTab";
import NewMissionDetailPart from "../components/MissionDetail/NewMissionDetailPart";
import {SafeAreaView, ScrollView, StatusBar} from "react-native";
import BottomTab from "../components/BottomTab";
import SideMenu from "../components/SideMenu";
import {useState} from "react";


export default function NewMissionDetail({route, navigation}) {
    const {missionData, hasVote} = route.params
    const [displayMenu, setDisplayMenu] = useState(false);

    return (
        <>
            {displayMenu && (
                <SideMenu displayMenu={(state) => setDisplayMenu(state)} navigation={navigation}/>
            )}
            <TopTab navigation={navigation} displayMenu={(state) => setDisplayMenu(state)}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <NewMissionDetailPart missionData={missionData} hasVote={hasVote} navigation={navigation}/>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}