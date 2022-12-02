import {useUserContext} from "../context/userContext";
import TopTab from "../components/TopTab";
import {useEffect, useState} from "react";
import SideMenu from "../components/SideMenu";
import {ScrollView, Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, SafeAreaView} from "react-native";
import BottomTab from "../components/BottomTab";
import star5 from "../assets/images/star_5.png";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Loading from "../components/Loading";
import EditProfile from "../components/EditProfile";
export default function Profile({route, navigation}) {
    const {getUserFromDb, user} = useUserContext()
    const {routeUser} = route.params

    const [displayMenu, setDisplayMenu] = useState(false);
    const [profilePicture, setProfilePicture] = useState("https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/profile-picture%2Fblank_pp.png?alt=media&token=f3a7e038-17f6-47f4-a187-16cf7c188b05");
    const [username, setUsername] = useState("");
    const [sanitizedUsername, setSanitizedUsername] = useState("");
    const [sanitizedEmail, setSanitizedEmail] = useState("");
    const [isUsernameSanitized, setIsUsernameSanitized] = useState(false);
    const [isEmailSanitized, setIsEmailSanitized] = useState(false);
    const [stars, setStars] = useState(0);
    const [revealUsername, setRevealUsername] = useState(false);
    const [switchMenu, setSwitchMenu] = useState(false);
    const [status, setStatus] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);
    const [displayEditProfile, setDisplayEditProfile] = useState(false);
    const [update, setUpdate] = useState(0);

    const SCREEN_WIDTH = Dimensions.get('window').width

    useEffect(() => {
        if (routeUser) {
            getUserFromDb(routeUser).then((res) => {
                res?.forEach((doc) => {
                    setStars(doc.data().stars)
                    setSanitizedEmail(doc.data().email)
                    setUsername(doc.data().username)
                    setSanitizedUsername(doc.data().username)
                    setProfilePicture(doc.data().profilePicture)
                    setStatus(doc.data()?.status)
                    setDataLoading(false)
                })
            })
        }
    }, [routeUser,update])

    const usernameSanitizer = (event) => {
        const WIDTH = event.nativeEvent.layout.width
        const BIGGEST_LETTER_WIDTH = 21.5
        const SCREEN_WIDTH_RATIO = 2.2
        const threshold = SCREEN_WIDTH/SCREEN_WIDTH_RATIO

        if (WIDTH > threshold) {
            setIsUsernameSanitized(true)
            const nb = Math.round((WIDTH-threshold)/BIGGEST_LETTER_WIDTH)
            const sub = sanitizedUsername.substring(0, sanitizedUsername.length - (nb-1))
            setSanitizedUsername(sub)
        }
    }

    const emailSanitizer = (event) => {
        const WIDTH = event.nativeEvent.layout.width
        const BIGGEST_LETTER_WIDTH = 12.5
        const SCREEN_WIDTH_RATIO = 2.2
        const THRESHOLD = SCREEN_WIDTH/SCREEN_WIDTH_RATIO

        console.log(WIDTH)

        if (WIDTH > THRESHOLD) {
            setIsEmailSanitized(true)
            const nb = Math.round((WIDTH-THRESHOLD)/BIGGEST_LETTER_WIDTH)
            const sub = sanitizedEmail.substring(0, sanitizedEmail.length - (nb-1))
            setSanitizedEmail(sub)
        }
    }

    return (
        <>
            {displayMenu && (
                <SideMenu displayMenu={(state) => setDisplayMenu(state)} navigation={navigation}/>
            )}
            {revealUsername && (
                <RevealSanitizedText text={username} close={(state) => setRevealUsername(!state)} />
            )}
            {displayEditProfile && (
                <EditProfile
                    displayEditProfile={(state) => setDisplayEditProfile(state)}
                    profilePicture={profilePicture}
                    updatePage={(state) => setUpdate(update+state)}
                />
            )}
            {(dataLoading || imageLoading) && (
                <Loading />
            )}
            <TopTab navigation={navigation} displayMenu={(state) => setDisplayMenu(state)}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.userInfo}>
                    <View style={styles.topSide}>
                        <View style={styles.leftSide}>
                            <Image
                                source={{uri: profilePicture}}
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 100,
                                    marginRight: 5,
                                    resizeMode: "contain"
                                }}
                                onLoadEnd={() => setImageLoading(false)}
                            />
                            <View style={styles.rightPart}>
                                {isUsernameSanitized ? (
                                    <TouchableOpacity onPress={() => setRevealUsername(true)}>
                                        <Text
                                            style={{
                                                color: "black",
                                                fontSize: 22,
                                                fontWeight: "bold"
                                            }}
                                            onLayout={(event) => usernameSanitizer(event)}
                                        >
                                            @{sanitizedUsername.toString()+"..."}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <Text
                                        style={{
                                            color: "black",
                                            fontSize: 22,
                                            fontWeight: "bold"
                                        }}
                                        onLayout={(event) => usernameSanitizer(event)}
                                    >
                                        @{sanitizedUsername.toString()}
                                    </Text>
                                )}
                                <Text
                                    style={{
                                        color: "#959595",
                                        fontSize: 13,

                                    }}
                                    onLayout={(event) => emailSanitizer(event)}
                                >{isEmailSanitized ? sanitizedEmail.toString()+"..." : sanitizedEmail.toString()}</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                height: 35,
                                width: 90,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: "white",
                                borderWidth: 1,
                                borderColor: "black",
                                borderRadius: 20,
                                marginRight: 6
                            }}
                        >

                            <Image
                                source={star5}
                                style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: 100,
                                    marginLeft: 6,
                                    resizeMode: "contain"
                                }}
                            />

                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 18,
                                    marginRight: 6
                                }}
                            >
                                {stars}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.userStats}>
                        <Text style={{fontSize: 15}}>
                            <Text style={{color: "#959595", fontWeight: "bold"}}>0</Text> Amis
                        </Text>

                        <Text style={{fontSize: 15}}>
                            <Text style={{color: "#959595", fontWeight: "bold"}}>0</Text> Tasks effectuées
                        </Text>
                    </View>

                    <View style={styles.status}>
                        {status && status.map((state, index) => (
                            <DisplayStatus type={state.type} value={state.value} key={index}/>
                        ))}
                    </View>

                    {routeUser === user?.uid ? (
                        <TouchableOpacity style={{marginRight: 15, alignSelf: "flex-end"}} onPress={() => setDisplayEditProfile(true)}>
                            <Octicons
                                name={"pencil"}
                                size={30}
                                color={"black"}
                            />
                        </TouchableOpacity>
                    ) : routeUser !== user?.uid ? (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                                alignSelf: "flex-end",
                            }}
                        >
                            <TouchableOpacity>
                                <Ionicons
                                    name={"ios-person-add-outline"}
                                    size={30}
                                    color={"black"}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={{marginLeft: 50, marginRight: 15}}>
                                <Feather
                                    name={"message-square"}
                                    size={30}
                                    color={"black"}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (<></>)}

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 20,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: (switchMenu ?  "white" : "#25995C"),
                                height: 40,
                                flex: 1
                            }}
                            onPress={() => setSwitchMenu(false)}
                        >
                            <Text
                                style={{
                                    color: (switchMenu ? "#25995C" : "white"),
                                    fontSize: 18,
                                    fontWeight: "bold"
                                }}
                            >
                                Task en cours
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: (switchMenu ? "#25995C" : "white"),
                                height: 40,
                                flex: 1
                            }}
                            onPress={() => setSwitchMenu(true)}
                        >
                            <Text
                                style={{
                                    color: (switchMenu ?  "white" : "#25995C"),
                                    fontSize: 18,
                                    fontWeight: "bold"
                                }}
                            >
                                Historique
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View>
                    {!switchMenu ? (
                        <View>
                            <Text>Task en cours</Text>
                        </View>
                    ) : (
                        <View>
                            <Text>Historique</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            <BottomTab navigation={navigation}/>
        </>
    )
}

const styles = StyleSheet.create({
    userInfo: {
        backgroundColor: "white",
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "#95959595"
    },
    topSide: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15
    },
    leftSide: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10
    },
    rightPart: {
        justifyContent: "center",
        alignItems: "flex-start"
    },
    userStats: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 15
    },
    status: {
        marginTop: 20,
        marginLeft: 10,
        alignItems: "flex-start"
    }
})

function RevealSanitizedText({text, close}) {
    const SCREEN_HEIGHT = Dimensions.get('window').height

    return (
        <>
            <TouchableOpacity
                style={{
                    backgroundColor: "rgba(114,114,114,0.58)",
                    opacity: 0.5,
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    zIndex: 98
                }}
                onPress={() => close(true)}
            >
            </TouchableOpacity>
            <View
                style={{
                    position: "absolute",
                    zIndex: 99,
                    backgroundColor: "white",
                    height: 35,
                    width: "80%",
                    borderWidth: 1,
                    borderColor: "black",
                    marginLeft: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    marginTop: SCREEN_HEIGHT/7
                }}

            >
                <Text
                    style={{
                        color: "black",
                        fontSize: 22,
                        fontWeight: "bold"
                    }}
                >
                    @{text}
                </Text>
            </View>
        </>
    )
}

function DisplayStatus({type, value}) {
    return (
        <>
            {type === 0 ? (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 25,
                        borderColor: "#FFC107",
                        backgroundColor: "white",
                        borderRadius: 20,
                        borderWidth: 1,
                        paddingLeft: 10,
                        paddingRight: 10
                }}
                >
                    <View
                        style={{
                            backgroundColor: "#FFC107",
                            borderRadius: 100,
                            height: 10,
                            width: 10
                        }}
                    >
                    </View>
                    <Text
                        style={{
                            color: "#FFC107",
                            marginLeft: 6,
                            fontSize: 13,
                            fontWeight: "bold"
                        }}
                    >
                        {value}
                    </Text>
                </View>
            ) : (
                <>
                    {value === "modo" ? (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                height: 25,
                                borderColor: "#004ef5",
                                backgroundColor: "white",
                                borderRadius: 20,
                                borderWidth: 1,
                                paddingLeft: 10,
                                paddingRight: 10,
                                marginTop: 10
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: "#004ef5",
                                    borderRadius: 100,
                                    height: 10,
                                    width: 10
                                }}
                            >
                            </View>
                            <Text
                                style={{
                                    color: "#004ef5",
                                    marginLeft: 6,
                                    fontSize: 13,
                                    fontWeight: "bold"
                                }}
                            >
                                Modération
                            </Text>
                        </View>
                    ) : (<></>)}
                </>
            )}
        </>
    )
}