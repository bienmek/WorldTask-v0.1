import {ActivityIndicator, Button, ScrollView, StatusBar, Text, View} from "react-native";
import TopTab from "../components/TopTab";
import {useUserContext} from "../context/userContext";
import {useEffect, useRef, useState} from "react";
import MenuTab from "../components/MenuTab";
import NewMissionCard from "../components/MissionCards/NewMissionCard";
import MissionReportCard from "../components/MissionCards/MissionReportCard";
import AvailableMissionCard from "../components/MissionCards/AvailableMissionCard";
import {newMissionData, availableMissionData, missionReportData} from "../firebase/mission-data-sample"
import BottomTab from "../components/BottomTab";
import SideMenu from "../components/SideMenu";
import {collection, getDocs, orderBy, query, limit} from "firebase/firestore"
import {db} from "../firebase";


export default function Home({navigation, route}) {
    const [menuState, setMenuState] = useState(0);
    const [displayMenu, setDisplayMenu] = useState(false);
    const [newMissionData, setNewMissionData] = useState([]);
    const [update, setUpdate] = useState(0);
    const [topLoading, setTopLoading] = useState(false);
    const [bottomLoading, setBottomLoading] = useState(false);
    const [previousIDs, setPreviousIDs] = useState([]);
    const [contentLimit, setContentLimit] = useState(2);

    const scrollPosition = useRef(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (menuState === 0) {
            setTopLoading(true)
            const q = query(collection(db, "new_tasks"), orderBy("creation_date", "desc"), limit(2))
            getDocs(q)
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id)
                        if (!newMissionData.some((item) => item.uid === doc.id)) {
                            if (newMissionData.some((item) => item.creation_date.seconds < doc.data().creation_date.seconds)) {
                                setNewMissionData((prevState) => [doc.data(), ...prevState])
                            } else {
                                setNewMissionData((prevState) => [...prevState, doc.data()])
                            }
                        } else {
                            if (newMissionData.some((item) => (item.uid === doc.id) && (
                                (item.title !== doc.data()) ||
                                (item.comments !== doc.data()) ||
                                (item.description !== doc.data()) ||
                                (item.images !== doc.data()) ||
                                (item.votes !== doc.data()) ||
                                (item.shares !== doc.data()))
                            )) {
                                const updatedItems = [...newMissionData];
                                updatedItems[newMissionData.findIndex((item) => item.uid === doc.id)] = doc.data();
                                setNewMissionData(updatedItems);
                            }
                        }
                    })
                })
                .finally(() => {
                    setTopLoading(false)
                })
        }
    }, [menuState, update, route.params])

    const handleScrollEndDrag = (event) => {
        const currentScrollPosition = event.nativeEvent.contentOffset.y;

        if (currentScrollPosition <= 0) {
            const scrollDifference = currentScrollPosition - scrollPosition.current;
            if (Math.abs(scrollDifference) > 50 && !topLoading) {
                setUpdate(update+1)
            }
        }
        scrollPosition.current = currentScrollPosition;
    };

    const handleScrollBottom = (event) => {
        const currentScrollPosition = event.nativeEvent.contentOffset.y;
        const totalHeight = event.nativeEvent.contentSize.height;

        // Calculate the current scroll percentage
        const scrollPercentage = currentScrollPosition / totalHeight;
        console.log(scrollPercentage)

        // If the scroll percentage is close to 1 (at the bottom), log a message to the console
        if (scrollPercentage > 0.4 && !bottomLoading) {
            setBottomLoading(true)
            setContentLimit(contentLimit+1)
            const q = query(collection(db, "new_tasks"), orderBy("creation_date", "desc"), limit(contentLimit))
            getDocs(q, 'desc')
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log("FROM BOTTOM SCROLL",previousIDs)
                        if (!previousIDs.includes(doc.id)) {
                            setPreviousIDs((prevState) => [...prevState, doc.id])
                            setNewMissionData((prevState) => [...prevState, doc.data()])
                        }
                    })
                })
                .finally(() => {
                    setBottomLoading(false)
                })
        }
    }

    return (
        <>
            {displayMenu && (
                <SideMenu displayMenu={(state) => setDisplayMenu(state)} navigation={navigation}/>
            )}
            <TopTab navigation={navigation} displayMenu={(state) => setDisplayMenu(state)}/>
            <MenuTab selectedMenu={setMenuState}/>
            <ScrollView
                showsVerticalScrollIndicator={true}
                scrollEventThrottle={1000}
                onScrollEndDrag={handleScrollEndDrag}
                ref={scrollRef}
                onScroll={handleScrollBottom}
            >
                {topLoading && (
                    <View style={{marginTop: 20, marginBottom: 20}}>
                        <ActivityIndicator size="large" color="#959595" />
                    </View>
                )}
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
                {bottomLoading && (
                    <View style={{marginTop: 20, marginBottom: 20}}>
                        <ActivityIndicator size="large" color="#959595" />
                    </View>
                )}
            </ScrollView>
            <BottomTab navigation={navigation}/>
        </>
    )
}