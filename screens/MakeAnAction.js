import {useState} from "react";
import SideMenu from "../components/SideMenu";
import TopTab from "../components/TopTab";
import BottomTab from "../components/BottomTab";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";


export default function MakeAnAction({navigation}) {
    const [displayMenu, setDisplayMenu] = useState(false);

    return (
        <>
            {displayMenu && (
                <SideMenu displayMenu={(state) => setDisplayMenu(state)} navigation={navigation}/>
            )}
            <TopTab navigation={navigation} displayMenu={(state) => setDisplayMenu(state)}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text
                    style={{
                        textAlign: "center",
                        marginTop: 10,
                        fontSize: 32,
                        fontWeight: "bold"
                    }}
                >
                    Faire une action
                </Text>

                <View
                    style={{
                        marginTop: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignSelf: "center",
                        width: "100%",
                        height: "100%"
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: "80%",
                            paddingHorizontal: 40,
                            paddingVertical: 20,
                            backgroundColor: "#25995C",
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        onPress={() => navigation.navigate("CreateTask")}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                color: "white",
                            }}
                        >
                            Créer une task
                        </Text>
                    </TouchableOpacity>

                    <View
                        style={{
                            width: "80%",
                            paddingVertical: 20,
                            backgroundColor: "#9a9a9a",
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                color: "white"
                            }}
                        >
                            Contacter une association
                        </Text>
                    </View>

                    <View
                        style={{
                            width: "80%",
                            paddingVertical: 20,
                            backgroundColor: "#9a9a9a",
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                color: "white"
                            }}
                        >
                           Rejoindre un groupe
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}