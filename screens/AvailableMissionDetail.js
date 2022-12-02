import TopTab from "../components/TopTab";
import {ScrollView} from "react-native";
import BottomTab from "../components/BottomTab";
import AvailableMissionDetailPart from "../components/MissionDetail/AvailableMissionDetailPart";


export default function AvailableMissionDetail({route, navigation}) {
    const {missionData, star, readOnly} = route.params

    return (
        <>
            <TopTab navigation={navigation}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AvailableMissionDetailPart missionData={missionData} star={star} readOnly={readOnly} navigation={navigation}/>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}