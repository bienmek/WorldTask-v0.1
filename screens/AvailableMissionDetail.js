import TopTab from "../components/TopTab";
import {ScrollView} from "react-native";
import BottomTab from "../components/BottomTab";
import AvailableMissionDetailPart from "../components/MissionDetail/AvailableMissionDetailPart";
import SideMenu from "../components/SideMenu";
import {useState} from "react";


export default function AvailableMissionDetail({route, navigation}) {
    const {missionData, star, readOnly} = route.params
    const [displayMenu, setDisplayMenu] = useState(false);

    return (
        <>
            {displayMenu && (
                <SideMenu displayMenu={(state) => setDisplayMenu(state)} navigation={navigation}/>
            )}
            <TopTab navigation={navigation}  displayMenu={(state) => setDisplayMenu(state)}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AvailableMissionDetailPart missionData={missionData} star={star} readOnly={readOnly} navigation={navigation}/>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}