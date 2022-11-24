import {Button, SafeAreaView, ScrollView, Text} from "react-native";
import TopTab from "../components/TopTab";
import {useUserContext} from "../context/userContext";
import {useEffect, useState} from "react";
import {db} from "../firebase";
import {collection, getDocs, query, where} from "firebase/firestore"
import MenuTab from "../components/MenuTab";
import NewMissionCard from "../components/MissionCards/NewMissionCard";
import MissionReportCard from "../components/MissionCards/MissionReportCard";
import AvailableMissionCard from "../components/MissionCards/AvailableMissionCard";
import data from "../firebase/mission-data-sample"
import Loading from "../components/Loading";
import BottomTab from "../components/BottomTab";


export default function Home({navigation}) {
    const [menuState, setMenuState] = useState(0);
    const {logoutUser} = useUserContext()

    return (
        <>
            <TopTab navigation={navigation}/>
            <MenuTab selectedMenu={setMenuState}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                {menuState === 0 ? (
                    <>
                        <NewMissionCard data={data} navigation={navigation}/>
                    </>
                ) : menuState === 1 ? (
                    <AvailableMissionCard />
                ) : (
                    <MissionReportCard />
                )}
            <Button title={"Logout"} onPress={logoutUser}/>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}