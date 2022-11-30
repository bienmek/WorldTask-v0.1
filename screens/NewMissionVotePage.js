import {ScrollView, Text, View} from "react-native";
import TopTab from "../components/TopTab";
import BottomTab from "../components/BottomTab";


export default function NewMissionVotePage({route, navigation}) {
    const {mission} = route.params
    return (
        <>
            <TopTab navigation={navigation} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text>
                    Votepage of {mission.title}
                </Text>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}