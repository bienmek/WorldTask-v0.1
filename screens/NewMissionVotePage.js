import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    TextInput,
    Keyboard,
    ActivityIndicator
} from "react-native";
import TopTab from "../components/TopTab";
import BottomTab from "../components/BottomTab";
import {useEffect, useRef, useState} from "react";
import SideMenu from "../components/SideMenu";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {doc, updateDoc, arrayUnion} from "firebase/firestore";
import {db} from "../firebase";
import {useUserContext} from "../context/userContext";


export default function NewMissionVotePage({route, navigation}) {
    const {mission} = route.params
    const [missionRelevance, setMissionRelevance] = useState(null);
    const [missionDifficulty, setMissionDifficulty] = useState(null);
    const [displayMenu, setDisplayMenu] = useState(false);
    const [reason, setReason] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [displayOther, setDisplayOther] = useState(false);
    const [otherText, setOtherText] = useState(null);

    const [relPos, setRelPos] = useState(null);
    const [diffPos, setDiffPos] = useState(null);
    const [reasonPos, setReasonPos] = useState(null);

    const [showRelDesc, setShowRelDesc] = useState(false);
    const [showDiffDesc, setShowDiffDesc] = useState(false);
    const [showReasonDesc, setShowReasonDesc] = useState(false);

    const [keyboardPadding, setKeyboardPadding] = useState(0);

    const [loading, setLoading] = useState(false);

    const scrollRef = useRef(null);

    const {user} = useUserContext()

    useEffect(() => {
        Keyboard.addListener('keyboardWillShow', () => {
            setKeyboardPadding(200)
        })
        Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardPadding(0)
        })
    }, [Keyboard])

    const onVote = () => {
        setLoading(true)
        const missionRef = doc(db, "new_tasks", mission.uid);
        const newVote = {
            voter: user.uid,
            mission_relevance: missionRelevance !== "2",
            missionDifficulty: missionDifficulty,
            reason: reason,
            other_precision: otherText > 250 ? otherText.substring(0, 250) : otherText
        }
        updateDoc(missionRef, {votes: arrayUnion(newVote)})
            .then(() => {
                setLoading(false)
                navigation.navigate("Home", {update: 3})
            })
    }

    return (
        <>
            {displayMenu && (
                <SideMenu displayMenu={(state) => setDisplayMenu(state)} navigation={navigation}/>
            )}
            <TopTab navigation={navigation} displayMenu={(state) => setDisplayMenu(state)}/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{marginTop: 3}}
                ref={scrollRef}
                scrollEventThrottle={16}
                onScroll={() => {
                    setShowRelDesc(false)
                    setShowDiffDesc(false)
                    setShowReasonDesc(false)
                }}

            >

                {loading && (
                    <View style={{marginTop: 20, marginBottom: 20}}>
                        <ActivityIndicator size="large" color="#959595" />
                    </View>
                )}

                {showRelDesc && (
                    <View
                        style={{
                            top: relPos+10,
                            position: "absolute",
                            zIndex: 99,
                            alignSelf: "center",
                            padding: 10,
                            width: "80%",
                            backgroundColor: "black",
                            justifyContent: "center",
                            opacity: 0.85,
                            borderRadius: 20
                        }}
                        onTouchEnd={() => setShowRelDesc(false)}
                    >
                        <View style={{justifyContent: "center", alignItems: "center"}}>
                            <Text
                                style={{
                                    fontSize: 22,
                                    color: "white",
                                    textDecorationLine: "underline"
                                }}
                            >
                                Aide:
                            </Text>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: "white",
                                    marginTop: 6,
                                    lineHeight: 25,
                                    opacity: 1,
                                    zIndex: 100,
                                }}
                            >
                                Pour juger de la pertinence d'une task vous pouvez vous baser sur trois critères:
                                {"\n"}- Est ce que la task a été <Bold text={"bien définie"}/> ?
                                {"\n"}- L'objectif de la task est il <Bold text={"clairement compréhensible"} /> et <Bold text={"atteignable"} /> ?
                                {"\n"}- Est ce que la task est <Bold text={"utile à l'environnement"} /> (<Bold text={"directement"} /> ou <Bold text={"indirectement"} />) ?
                            </Text>
                        </View>
                    </View>
                )}

                {showDiffDesc && (
                    <View
                        style={{
                            top: diffPos,
                            position: "absolute",
                            zIndex: 99,
                            alignSelf: "center",
                            padding: 10,
                            width: "80%",
                            backgroundColor: "black",
                            borderRadius: 20,
                            opacity: 0.85
                        }}
                        onTouchEnd={() => setShowDiffDesc(false)}
                    >
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 1
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 22,
                                    color: "white",
                                    textDecorationLine: "underline"
                                }}
                            >
                                Aide:
                            </Text>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: "white",
                                    marginTop: 6,
                                    lineHeight: 25
                                }}
                            >
                                Pour juger la difficulté de la task vous pouvez: estimer <Bold text={"le temps que ça pourrait prendre"} />,
                                le <Bold text={"nombre de personne"} /> qu'il faudrait, s'il faut avoir recours à des <Bold text={"outils spécifiques"} />, etc...
                            </Text>
                        </View>
                    </View>
                )}

                {showReasonDesc && (
                    <View
                        style={{
                            top: reasonPos,
                            position: "absolute",
                            zIndex: 99,
                            alignSelf: "center",
                            padding: 10,
                            width: "80%",
                            backgroundColor: "black",
                            opacity: 0.85,
                            borderRadius: 20

                        }}
                        onTouchEnd={() => setShowReasonDesc(false)}
                    >
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 22,
                                    color: "white",
                                    textDecorationLine: "underline"
                                }}
                            >
                                Aide:
                            </Text>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: "white",
                                    marginTop: 6,
                                    lineHeight: 25
                                }}
                            >
                                Indiquez la raison qui vous parait <Bold text={"la plus pertinente"} />. N'hésitez pas à mettre <Bold text={"\"Manque d'information\""} />
                                si vous trouvez que la task a été <Bold text={"mal définie"} />. N'oubliez pas de <Bold text={"préciser la raison"} /> si vous choisissez <Bold text={"\"Autres\""} />.
                            </Text>
                        </View>
                    </View>
                )}


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
                    onLayout={(event) => {
                        const { x, y } = event.nativeEvent.layout;
                        console.log("Rel pos", y)
                        setRelPos(y);
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%"
                        }}

                    >
                        <Text
                            style={{
                                fontSize: 22,
                                color: "black",
                                textAlign: "center"
                            }}>
                            La task est elle pertinente ?
                        </Text>

                        <TouchableOpacity
                            style={{
                                backgroundColor: "black",
                                height: 30,
                                width: 30,
                                borderRadius: 100,
                                marginLeft: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 0.7,
                            }}
                            onPress={() => setShowRelDesc(true)}
                        >
                            <FontAwesome5
                                name={"question"}
                                size={15}
                                color={"white"}
                            />
                        </TouchableOpacity>
                    </View>

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
                            onPress={() => {
                                setMissionRelevance("1")
                                setMenuOpen(false)
                                setDisplayOther(false)
                                setReason("")
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={{color: "white", fontSize: 18}}>oui</Text>
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
                            onPress={() => {
                                setMissionRelevance("2")
                                setMissionDifficulty(null)
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={{color: "white", fontSize: 18}}>non</Text>
                        </TouchableOpacity>
                </View>

                {missionRelevance === "1" && (
                    <View
                        style={{
                            backgroundColor: "white",
                            borderBottomWidth: 1,
                            borderTopWidth: 1,
                            borderColor: "#95959595",
                            height: 150,
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 3,
                        }}
                        onLayout={(event) => {
                            const { x, y } = event.nativeEvent.layout;
                            console.log("Diff Pos:", y)
                            setDiffPos(y);
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%"
                            }}

                        >
                            <Text
                                style={{
                                    fontSize: 22,
                                    color: "black",
                                    textAlign: "center"
                                }}>
                                Attribuez lui une difficulté
                            </Text>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "black",
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100,
                                    marginLeft: 20,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    opacity: 0.7,
                                }}
                                onPress={() => setShowDiffDesc(true)}
                            >
                                <FontAwesome5
                                    name={"question"}
                                    size={15}
                                    color={"white"}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{flexDirection: "row"}}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: (missionDifficulty === "1" ? "#0e3f27" : "#25995C"),
                                    height: 50,
                                    width: 50,
                                    marginTop: 20,
                                    marginRight: 10,
                                    borderRadius: 10,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                onPress={() => setMissionDifficulty("1")}
                                activeOpacity={0.7}

                            >
                                <Text style={{color: "white", fontSize: 18}}>1</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: (missionDifficulty === "2" ? "#0e3f27" : "#25995C"),
                                    height: 50,
                                    width: 50,
                                    marginTop: 20,
                                    borderRadius: 10,
                                    marginRight: 10,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                onPress={() => setMissionDifficulty("2")}
                                activeOpacity={0.7}
                            >
                                <Text style={{color: "white", fontSize: 18}}>2</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: (missionDifficulty === "3" ? "#0e3f27" : "#25995C"),
                                    height: 50,
                                    width: 50,
                                    marginTop: 20,
                                    marginRight: 10,
                                    borderRadius: 10,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                onPress={() => setMissionDifficulty("3")}
                                activeOpacity={0.7}
                            >
                                <Text style={{color: "white", fontSize: 18}}>3</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: (missionDifficulty === "4" ? "#0e3f27" : "#25995C"),
                                    height: 50,
                                    width: 50,
                                    marginTop: 20,
                                    marginRight: 10,
                                    borderRadius: 10,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                onPress={() => setMissionDifficulty("4")}
                                activeOpacity={0.7}
                            >
                                <Text style={{color: "white", fontSize: 18}}>4</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: (missionDifficulty === "5" ? "#0e3f27" : "#25995C"),
                                    height: 50,
                                    width: 50,
                                    marginTop: 20,
                                    marginRight: 10,
                                    borderRadius: 10,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                onPress={() => setMissionDifficulty("5")}
                                activeOpacity={0.7}
                            >
                                <Text style={{color: "white", fontSize: 18}}>5</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {missionRelevance === "2" && (
                    <View
                        style={{
                            backgroundColor: "white",
                            borderBottomWidth: 1,
                            borderTopWidth: 1,
                            borderColor: "#95959595",
                            height: menuOpen && displayOther ?
                                350 : menuOpen && !displayOther ?
                                    320 : !menuOpen && displayOther ?
                                        200+keyboardPadding : 150,
                            width: "100%",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            marginTop: 3,
                        }}
                        onLayout={(event) => {
                            const { y } = event.nativeEvent.layout;
                            console.log("Reason pos", y)
                            setReasonPos(y);
                            scrollRef?.current?.scrollToEnd({animated: true})
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 22,
                                    marginTop: 20,
                                    color: "black",
                                    textAlign: "center"
                                }}>
                                Veuillez indiquer la raison
                            </Text>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "black",
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100,
                                    marginLeft: 20,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    opacity: 0.7,
                                    top: 10
                                }}
                                onPress={() => setShowReasonDesc(true)}
                            >
                                <FontAwesome5
                                    name={"question"}
                                    size={15}
                                    color={"white"}
                                />
                            </TouchableOpacity>
                        </View>

                        <DropdownMenu callBackReason={setReason} isOpen={setMenuOpen} isOther={setDisplayOther}/>

                        {displayOther && (
                            <View
                                style={{
                                    width: "80%",
                                }}
                            >
                                <TextInput
                                    placeholder={"Précisez..."}
                                    style={styles.input}
                                    onChangeText={(arg) => setOtherText(arg)}
                                    keyboardType={"twitter"}
                                />
                            </View>
                        )}

                    </View>
                )}

                {((missionRelevance !== null && missionDifficulty !== null) || reason) && (
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
                                fontSize: 25
                            }}
                        >
                            Voter
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}

function Bold ({text}) {
    return (
        <Text style={{fontWeight: "bold"}}>{text}</Text>
    )
}
function DropdownMenu ({callBackReason, isOpen, isOther}) {
    const [displayMenu, setDisplayMenu] = useState(false);
    const [selectedValue, setSelectedValue] = useState("Sélectionner");
    const data = [
        "Contenu inapproprié",
        "Manque d'information",
        "Aucune utilité pour la cause",
        "Dessert un acteur privé",
        "Autres"
    ]

    return (
        <>
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "80%",
                    marginTop: 20,
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: displayMenu ? "#0e3f27" : "#25995C",
                        padding: 10,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        borderBottomWidth: displayMenu && 1,
                        borderColor: "white",
                        borderBottomRightRadius: !displayMenu && 20,
                        borderBottomLeftRadius: !displayMenu && 20,
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20
                    }}
                    onPress={() => {
                        setDisplayMenu(!displayMenu)
                        isOpen(!displayMenu)
                    }}
                    activeOpacity={0.7}
                >
                    <View
                        style={{
                            position: "absolute",
                            alignSelf: "center",
                            left: 20
                        }}
                    >
                        {displayMenu ? (
                            <AntDesign
                                name={"up"}
                                size={20}
                                color={"white"}
                            />
                        ) : (
                            <AntDesign
                                name={"down"}
                                size={20}
                                color={"white"}
                            />
                        )}
                    </View>

                    <Text
                        style={{
                            color: "white",
                            fontSize: 16
                        }}
                    >
                        {selectedValue}
                    </Text>
                </TouchableOpacity>

                {displayMenu && (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            backgroundColor: "#25995C",
                            borderBottomRightRadius: 20,
                            borderBottomLeftRadius: 20,
                        }}
                    >
                        {data.map((reason, index) => (
                            <View key={index} style={{width: "100%"}}>
                                {selectedValue !== reason && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            callBackReason(reason)
                                            setSelectedValue(reason)
                                            setDisplayMenu(false)
                                            isOpen(false)
                                            if (reason === "Autres") {
                                                isOther(true)
                                            } else {
                                                isOther(false)
                                            }
                                        }}
                                        style={{
                                            padding: 10,
                                            borderBottomWidth: reason !== "Autres" && 1,
                                            borderColor: "white",
                                            width: "100%",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Text
                                            style={{
                                                color: "white",
                                                fontSize: 16
                                            }}
                                        >
                                            {reason}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: "white",
        borderColor: "#959595",
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: "100%",
        marginTop: 10,
        marginBottom: 20,
        fontSize: 15,
    }
})