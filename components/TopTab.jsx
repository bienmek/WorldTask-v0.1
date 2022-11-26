import {View, StyleSheet, Image, TouchableOpacity, StatusBar} from "react-native";
import feuille from "../assets/top-tab/feuille.png"
import arrow from "../assets/top-tab/arrow-thin.png"
import {useUserContext} from "../context/userContext";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebase";
import {useEffect, useState} from "react";

export default function TopTab({navigation}) {
    const {user, getUserFromDb} = useUserContext()
    const [profilePicture, setProfilePicture] = useState("https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/profile-picture%2Fblank_pp.png?alt=media&token=f3a7e038-17f6-47f4-a187-16cf7c188b05");


    useEffect(() => {
        if (user?.uid) {
            getUserFromDb(user.uid).then((res) => {
                res?.forEach((doc) => {
                    console.log(doc.data())
                    setProfilePicture(doc.data().profilePicture)
                })
            })
        }
    }, [user,])

    return (
        <>
            <StatusBar barStyle={"dark-content"}/>
            <View style={styles.tab}>
                <View style={styles.container}>
                    {navigation.canGoBack() ? (
                        <View style={{flex: 1}}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Image
                                    source={arrow}
                                    style={{
                                        width: 30,
                                        height: 30,
                                        marginLeft: 15,
                                        resizeMode: "contain",
                                        transform: [{rotateZ: "90deg"}]
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (<View style={{flex: 1}}></View>)}

                    <Image
                        source={feuille}
                        style={{
                            width: 40,
                            height: 40,
                            flex: 5,
                            resizeMode: "contain",
                            transform: [{rotateZ: "20deg"}]
                        }}
                    />

                    {user?.emailVerified ? (
                        <TouchableOpacity style={{flex: 1}}>
                            <Image
                                source={{uri: profilePicture}}
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 100,
                                    marginRight: 5,
                                    resizeMode: "contain"
                                }}
                            />
                        </TouchableOpacity>
                        ) : (<View style={{flex: 1}}></View>)}
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    tab: {
        height: 75,
        backgroundColor: "white",
        borderBottomWidth: 0.5,
        borderBottomColor: "#959595",
    },
    container: {
        height: "100%",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15
    }
})