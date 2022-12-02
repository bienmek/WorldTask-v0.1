import {useUserContext} from "../context/userContext";
import TopTab from "../components/TopTab";
import {useState} from "react";
import SideMenu from "../components/SideMenu";
import {ScrollView, Text, View, StyleSheet} from "react-native";
import BottomTab from "../components/BottomTab";


export default function Profile({navigation}) {
    const {profilePicture, username, getUserFromDb} = useUserContext()
    const [displayMenu, setDisplayMenu] = useState(false);

    return (
        <>
            {displayMenu && (
                <SideMenu displayMenu={(state) => setDisplayMenu(state)} navigation={navigation}/>
            )}
            <TopTab navigation={navigation} displayMenu={(state) => setDisplayMenu(state)}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={styles.userInfo}>

                    </View>
                </View>
            </ScrollView>
            <BottomTab navigation={navigation}/>
        </>
    )
}

const styles = StyleSheet.create({
    userInfo: {
        
    }
})