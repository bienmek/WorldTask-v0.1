import {useEffect, useState} from "react";
import SideMenu from "../components/SideMenu";
import TopTab from "../components/TopTab";
import BottomTab from "../components/BottomTab";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../firebase";
import {useUserContext} from "../context/userContext";


export default function MakeAnAction({navigation}) {
    const [displayMenu, setDisplayMenu] = useState(false);
    const [canCreateTask, setCanCreateTask] = useState(false);
    const [error, setError] = useState('');

    const {user} = useUserContext()

    useEffect(() => {
        setError("")
        onSnapshot(doc(db, "taskers", user.uid), (snapshot) => {
            const dbUser = snapshot.data()
            if (!dbUser.ongoing_task) {
                setCanCreateTask(true)
            }
        })
    }, []);


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
                        onPress={() => {
                            if (canCreateTask) {
                                setError("")
                                navigation.navigate("CreateTask")
                            } else {
                                setError("Erreur: vous avez déjà une task en cours !")
                            }
                        }}
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

                {error && (
                    <Text
                        style={{
                            color: "red",
                            fontSize: 13,
                            alignSelf: "center",
                        }}
                    >
                        {error}
                    </Text>
                )}
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}