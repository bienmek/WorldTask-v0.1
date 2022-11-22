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


export default function Home({navigation}) {
    const {user} = useUserContext()
    const [profilePicture, setProfilePicture] = useState("https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/profile-picture%2Fblank_pp.png?alt=media&token=f3a7e038-17f6-47f4-a187-16cf7c188b05");
    const [menuState, setMenuState] = useState(0);
    const [newMissionLoading, setNewMissionLoading] = useState(false);
    const [topTabLoading, setTopTabLoading] = useState(false);

    const getProfilePicture = async () => {
        if (user) {
            const taskers = collection(db, "taskers")
            const q = query(taskers, where("uid", "==", user.uid))
            return await getDocs(q)
        }
    }

    useEffect(() => {
        getProfilePicture().then((res) => {
            res?.forEach((doc) => {
                console.log(doc.data())
                setProfilePicture(doc.data().profilePicture)
            })
        })
    }, [user,])

    return (
        <>
            <TopTab navigation={navigation} profilePicture={profilePicture}/>
            <MenuTab selectedMenu={setMenuState}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                {menuState === 0 ? (
                    <>
                        <NewMissionCard data={data}/>
                    </>
                ) : menuState === 1 ? (
                    <AvailableMissionCard />
                ) : (
                    <MissionReportCard />
                )}
            </ScrollView>
        </>
    )
}