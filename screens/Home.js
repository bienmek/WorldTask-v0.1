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
import {collection, getDocs, orderBy, query, limit, onSnapshot} from "firebase/firestore"
import {db} from "../firebase";


export default function Home({navigation, route}) {
    const [menuState, setMenuState] = useState(0);
    const [displayMenu, setDisplayMenu] = useState(false);
    const [dbMissionData, setDbMissionData] = useState([]);
    const [update, setUpdate] = useState(0);
    const [topLoading, setTopLoading] = useState(false);
    const [bottomLoading, setBottomLoading] = useState(false);
    const [contentLimit, setContentLimit] = useState(10);
    const [displayCategory, setDisplayCategory] = useState(null);

    const scrollPosition = useRef(0);
    const scrollRef = useRef(null);

    useEffect(() => {

        setTopLoading(true)

        retrieveTopData()

        if (menuState === 0) {
            setDisplayCategory(0)
        } else if (menuState === 1) {
            setDisplayCategory(1)
        } else {
            setDisplayCategory(2)
        }

        setTopLoading(false)

    }, [menuState, update, route.params])

    const retrieveTopData = () => {
        setDbMissionData([])
        const q = query(collection(db, menuState === 0 ? "new_tasks" : menuState === 1 && "available_tasks"), orderBy("creation_date", "desc"), limit(5))
        const unsub = onSnapshot(q, (snapshot) => {
            snapshot.forEach((doc) => {
                setDbMissionData((prev) => [...prev, doc.data()])
            })
        })
        return () => {
            unsub()
        }
    }

    const retrieveBottomData = () => {
        const q = query(collection(db, menuState === 0 ? "new_tasks" : menuState === 1 && "available_tasks"), orderBy("creation_date", "desc"), limit(contentLimit))
        const unsub = onSnapshot(q, (snapshot) => {
            snapshot.forEach((doc) => {
                if (!dbMissionData.some((item) => item.uid === doc.id)) {
                    if (dbMissionData.some((item) => item.creation_date.seconds < doc.data().creation_date.seconds)) {
                        setDbMissionData((prevState) => [doc.data(), ...prevState])
                    } else {
                        setDbMissionData((prevState) => [...prevState, doc.data()])
                    }
                } else if (displayCategory === 0) {
                    if (dbMissionData.some((item) => (item.uid === doc.id) && (
                            (item.title !== doc.data().title) ||
                            (JSON.stringify(item.comments) !== JSON.stringify(doc.data().comments)) ||
                            (item.description !== doc.data().description) ||
                            (JSON.stringify(item.images) !== JSON.stringify(doc.data().images)) ||
                            (!item.votes.every((value, index) => JSON.stringify(value) === JSON.stringify(doc.data().votes[index]))) ||
                            (!item.shares.every((value, index) => JSON.stringify(value) === JSON.stringify(doc.data().shares[index]))) ||
                            (JSON.stringify(item.location) !== JSON.stringify(doc.data().location))
                        )
                    )) {
                        const updatedItems = [...dbMissionData];
                        updatedItems[dbMissionData.findIndex((item) => item.uid === doc.id)] = doc.data();
                        setDbMissionData(updatedItems);
                    }
                }
            })
        })

        return () => {
            unsub()
        }
    }

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
        if (scrollPercentage > 0.75 && !bottomLoading && !topLoading) {
            setBottomLoading(true)
            setBottomLoading(true)
            retrieveBottomData()
            setBottomLoading(false)
            setContentLimit(contentLimit+5)
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
                scrollEventThrottle={600}
                onScrollEndDrag={handleScrollEndDrag}
                ref={scrollRef}
                onScroll={handleScrollBottom}
            >
                {topLoading && (
                    <View style={{marginTop: 20, marginBottom: 20}}>
                        <ActivityIndicator size="large" color="#959595" />
                    </View>
                )}
                {displayCategory === 0 ? (
                    <>
                        {dbMissionData.map((missionData, index) => {
                            return (
                                <NewMissionCard data={missionData} navigation={navigation} key={index}/>
                            )
                        })}
                    </>
                ) : displayCategory === 1 ? (
                    <>
                        {dbMissionData.map((missionData, index) => {
                            return (
                                <AvailableMissionCard data={missionData} navigation={navigation} key={index}/>
                            )
                        })}
                    </>
                ) : displayCategory === 3 ? (
                    <>
                        {missionReportData.map((missionData, index) => (
                            <MissionReportCard data={missionData} availableMissionData={availableMissionData} navigation={navigation} key={index}/>
                        ))}
                    </>
                ) : (<></>)}
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