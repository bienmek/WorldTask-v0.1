import {useState} from "react";
import SideMenu from "../components/SideMenu";
import TopTab from "../components/TopTab";
import BottomTab from "../components/BottomTab";
import {ScrollView, Text, View} from "react-native";


export default function Notifications({navigation}) {
    const [displayMenu, setDisplayMenu] = useState(false);

    return (
        <>
            {displayMenu && (
                <SideMenu displayMenu={(state) => setDisplayMenu(state)} navigation={navigation}/>
            )}
            <TopTab navigation={navigation} displayMenu={(state) => setDisplayMenu(state)}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <Text>
                        Notifications Here !
                    </Text>
                </View>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}