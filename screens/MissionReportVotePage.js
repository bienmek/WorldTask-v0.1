import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import TopTab from "../components/TopTab";
import BottomTab from "../components/BottomTab";
import {useState} from "react";
import SideMenu from "../components/SideMenu";


export default function MissionReportVotePage({route, navigation}) {
    const {mission} = route.params
    const [missionRelevance, setMissionRelevance] = useState("0");
    const [displayMenu, setDisplayMenu] = useState(false);
    const onVote = () => {
        navigation.goBack()
    }


    return (
        <>
            {displayMenu && (
                <SideMenu displayMenu={(state) => setDisplayMenu(state)} navigation={navigation}/>
            )}
            <TopTab navigation={navigation} displayMenu={(state) => setDisplayMenu(state)}/>
            <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 3}}>
                <View
                    style={{
                        backgroundColor: "white",
                        borderBottomWidth: 1,
                        borderTopWidth: 1,
                        borderColor: "#95959595",
                        height: 200,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 22,
                            color: "black"
                        }}>
                        La mission est elle pertinente ?
                    </Text>

                    <TouchableOpacity
                        style={{
                            backgroundColor: (missionRelevance === "1" ? "#0e3f27" : "#25995C"),
                            height: 40,
                            width: "80%",
                            marginTop: 20,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        onPress={() => setMissionRelevance("1")}
                        activeOpacity={0.7}
                    >
                        <Text style={{color: "white", fontWeight: "bold", fontSize: 22}}>oui</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: (missionRelevance === "2" ? "#0e3f27" : "#25995C"),
                            height: 40,
                            width: "80%",
                            marginTop: 5,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        onPress={() => setMissionRelevance("2")}
                        activeOpacity={0.7}
                    >
                        <Text style={{color: "white", fontWeight: "bold", fontSize: 22}}>non</Text>
                    </TouchableOpacity>
                </View>


                {missionRelevance !== "0" && (
                    <TouchableOpacity
                        style={{
                            backgroundColor: "white",
                            borderBottomWidth: 1,
                            borderTopWidth: 1,
                            borderColor: "#95959595",
                            height: 60,
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 3,
                        }}
                        activeOpacity={0.7}
                        onPress={onVote}
                    >
                        <Text
                            style={{
                                color: "black",
                                fontWeight: "bold",
                                fontSize: 25
                            }}
                        >
                            Voter
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
            <BottomTab navigation={navigation}/>
        </>
    )
}