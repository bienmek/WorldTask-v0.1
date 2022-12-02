import {Dimensions, Image, SafeAreaView, ScrollView, Text, View} from "react-native";
import TopTab from "../components/TopTab";
import BottomTab from "../components/BottomTab";
import SideMenu from "../components/SideMenu";
import {useState} from "react";


export default function ImageViewer({route, navigation}) {
    const {routeImage} = route.params
    const [displayMenu, setDisplayMenu] = useState(false);
    const SCREEN_WIDTH = Dimensions.get('window').width
    const SCREEN_HEIGHT = Dimensions.get('window').height


    return (
        <>
            {displayMenu && (
                <SideMenu displayMenu={(state) => setDisplayMenu(state)} navigation={navigation}/>
            )}
            <TopTab navigation={navigation} displayMenu={(state) => setDisplayMenu(state)}/>
            <Image
                source={{uri: routeImage}}
                style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT*0.9,
                    resizeMode: "contain",
                }}
            />
        </>
    )
}