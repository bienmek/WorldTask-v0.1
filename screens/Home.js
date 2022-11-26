import {Button, ScrollView, StatusBar} from "react-native";
import TopTab from "../components/TopTab";
import {useUserContext} from "../context/userContext";
import {useState} from "react";
import MenuTab from "../components/MenuTab";
import NewMissionCard from "../components/MissionCards/NewMissionCard";
import MissionReportCard from "../components/MissionCards/MissionReportCard";
import AvailableMissionCard from "../components/MissionCards/AvailableMissionCard";
import {newMissionData, availableMissionData, missionReportData} from "../firebase/mission-data-sample"
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
                        {newMissionData.map((missionData, index) => (
                            <NewMissionCard data={missionData} navigation={navigation} key={index}/>
                        ))}
                    </>
                ) : menuState === 1 ? (
                    <>
                        {availableMissionData.map((missionData, index) => (
                            <AvailableMissionCard data={missionData} navigation={navigation} key={index}/>

                        ))}
                    </>
                ) : (
                    <>
                        {missionReportData.map((missionData, index) => (
                            <MissionReportCard data={missionData} availableMissionData={availableMissionData} navigation={navigation} key={index}/>
                        ))}
                    </>
                )}
            <Button title={"Logout"} onPress={logoutUser}/>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}