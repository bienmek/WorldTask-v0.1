import {Button, Text, TouchableOpacity, View, StyleSheet, Image, Dimensions} from "react-native";
import {useUserContext} from "../context/userContext";
import {useEffect, useRef, useState} from "react";
import star5 from "../assets/images/star_5.png"
import profile from "../assets/images/profile.png"
import friends from "../assets/images/friends.png"
import map from "../assets/images/map.png"
import reward from "../assets/images/reward.png"
import ranking from "../assets/images/ranking.png"
import about from "../assets/images/about.png"
import settings from "../assets/images/settings.png"
import logout from "../assets/images/logout_red.png"

export default function SideMenu({displayMenu, navigation}) {
    const {user, profilePicture, getUserFromDb, username, logoutUser} = useUserContext()
    const [star, setStar] = useState(0);
    const [sanitizedUsername, setSanitizedUsername] = useState(username);
    const [isSanitized, setIsSanitized] = useState(false);
    const usernameRef = useRef(null);
    const SCREEN_WIDTH = Dimensions.get('window').width

    useEffect(() => {
        if (user?.uid) {
            getUserFromDb(user?.uid).then((res) => {
                res?.forEach((doc) => {
                    setStar(doc.data().stars)
                })
            })
        }
    }, [user,])

    const dynamicTextSanitizer = (event) => {
        const width = event.nativeEvent.layout.width
        const threshold = SCREEN_WIDTH/2.34
        if (width > threshold) {
            setIsSanitized(true)
            const nb = Math.round((width-threshold)/15)
            const sub = sanitizedUsername.substring(0, sanitizedUsername.length - (nb+1))
            setSanitizedUsername(sub)
        }
    }

    return (
        <>
            <TouchableOpacity
                style={{
                    backgroundColor: "rgba(114,114,114,0.58)",
                    opacity: 0.5,
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    zIndex: 200
                }}
                onPress={() => displayMenu(false)}
            >
            </TouchableOpacity>

            <View
                style={{
                    height: "100%",
                    width: "80%",
                    backgroundColor: "white",
                    position: "absolute",
                    zIndex: 201,
                    alignSelf: "flex-end",
                }}
            >
                <View style={styles.topSide}>
                    <View style={styles.userInfo}>
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            onPress={() => navigation.navigate("Profile", {routeUser: user?.uid})}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={{uri: profilePicture}}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 100,
                                    marginRight: 5,
                                    resizeMode: "contain"
                                }}
                            />

                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 15,
                                    fontWeight: "bold",
                                }}
                                ref={usernameRef}
                                onLayout={(event) => dynamicTextSanitizer(event, 160)}
                            >
                                @{isSanitized ? sanitizedUsername.toString()+"..." : sanitizedUsername.toString()}
                            </Text>
                        </TouchableOpacity>

                        <View
                            style={{
                                height: 25,
                                width: 65,
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
                                    width: 20,
                                    height: 20,
                                    borderRadius: 100,
                                    marginLeft: 3,
                                    resizeMode: "contain"
                                }}
                            />

                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 13,
                                    marginRight: 3
                                }}
                            >
                                {star}
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
                </View>
                <View style={styles.content}>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Profile", {routeUser: user?.uid})
                            displayMenu(false)
                        }}
                    >
                        <MenuItem title={"Profil"} icon={profile} color={"black"}/>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <MenuItem title={"Amis"} icon={friends} color={"black"}/>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <MenuItem title={"Carte"} icon={map} color={"black"}/>
                    </TouchableOpacity>

                    <View style={{marginTop: 10, width: "100%", backgroundColor: "#959595", height: 1}}></View>

                    <TouchableOpacity>
                        <MenuItem title={"Classement"} icon={ranking} color={"black"}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                        <MenuItem title={"Récompenses"} icon={reward} color={"black"}/>
                        <Image
                            source={star5}
                            style={{
                                width: 25,
                                height: 25,
                                marginLeft: 3,
                                marginTop: 20
                            }}
                        />
                    </TouchableOpacity>

                    <View style={{marginTop: 10, width: "100%", backgroundColor: "#959595", height: 1}}></View>

                    <TouchableOpacity>
                        <MenuItem title={"À propos"} icon={about} color={"black"}/>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <MenuItem title={"Paramètres"} icon={settings} color={"black"}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={logoutUser}>
                        <MenuItem title={"Se déconnecter"} icon={logout} color={"red"}/>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    topSide: {
        flexDirection: "column",
        marginTop: 35
    },
    userInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 6

    },
    userStats: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        borderBottomWidth: 1,
        height: 50,
        borderColor: "#959595"
    },
    content: {
    }
})

function MenuItem({title, icon, color}) {
    return (
        <View style={{flexDirection: "row", marginTop: 20, marginLeft: 10}}>
            <Image
                source={icon}
                style={{
                    height: 20,
                    width: 20
                }}
            />
            <Text
                style={{
                    color: color,
                    fontSize: 18,
                    marginLeft: 6
                }}
            >
                {title}
            </Text>
        </View>
    )
}