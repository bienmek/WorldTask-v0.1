import {ScrollView, Text, View} from "react-native";
import TopTab from "../components/TopTab";
import BottomTab from "../components/BottomTab";


export default function MissionReportVotePage({route, navigation}) {
    const {mission} = route.params
    return (
        <>
            <TopTab navigation={navigation} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text>
                    Mission report vote page of {mission.reporter}
                </Text>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}