import TopTab from "../components/TopTab";
import {ScrollView} from "react-native";
import BottomTab from "../components/BottomTab";
import AvailableMissionDetailPart from "../components/MissionDetail/AvailableMissionDetailPart";


export default function AvailableMissionDetail({route, navigation}) {
    const {missionData, star} = route.params

    return (
        <>
            <TopTab navigation={navigation}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AvailableMissionDetailPart missionData={missionData} star={star}/>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}