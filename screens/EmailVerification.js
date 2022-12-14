import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import TopTab from "../components/TopTab";
import {useUserContext} from "../context/userContext";
import {useEffect, useState} from "react";
import {setDoc, doc} from "firebase/firestore"
import {db} from "../firebase";

export default function EmailVerification({route, navigation}) {
    const {routeMail, routePassword} = route.params
    const [error, setError] = useState("");
    const {loginUser, user, loading, setLoading, sendEmail, logoutUser} = useUserContext()

    const emailVerified = () => {
        setLoading(true)
        loginUser(routeMail, routePassword)
            .then(async (res) => {
                if (res.user.emailVerified) {
                    logoutUser()
                    loginUser(routeMail, routePassword)
                    await setDoc(doc(db, "taskers", user.uid), {
                        uid: user.uid,
                        email: user.email,
                        username: user.displayName,
                        profilePicture: "https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/profile_picture%2Fblank_pp.png?alt=media&token=0c6a438a-6dcf-4491-94d5-c1ee187e6c08",
                        stars: 0,
                        ongoing_task: null
                    })
                }
                else {
                    setError("Erreur: vous n'avez pas fait vérifier votre adresse e-mail")
                }
            })
            .finally(() => setLoading(false))
    }

    const resendEmail = () => {
        sendEmail()
    }

    return (
        <>
            <TopTab navigation={navigation}/>
            <SafeAreaView style={{justifyContent: "flex-start", marginTop: 30, marginLeft: 10, flex: 1, alignItems: "center"}}>
                {loading && (
                    <Text style={{marginTop: 10, color: "#25995C", fontSize: 15, fontWeight: "bold", textAlign: "center"}}>Chargement...</Text>
                )}

                {error && (
                    <Text style={{marginTop: 10, color: "red", fontSize: 13}}>{error}</Text>
                )}
                <View style={{alignItems: "flex-start"}}>
                    <Text style={{fontSize: 18}}>
                        Un e-mail de vérification a été envoyé à l'adresse suivante: <Text style={{fontWeight: "bold"}}>{routeMail}</Text>
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={emailVerified}
                >
                    <Text style={{color: "white", fontSize: 16 ,fontWeight: "bold"}}>
                        Suivant
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonWhite}
                    onPress={resendEmail}
                >
                    <Text style={{color: "#25995C", fontSize: 16 ,fontWeight: "bold"}}>
                        Renvoyer
                    </Text>
                </TouchableOpacity>

            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 300,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#25995C",
        borderRadius: 10,
        marginTop: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonWhite: {
        width: 300,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: "#25995C",
        borderWidth: 1,
        marginTop: 15,
        justifyContent: "center",
        alignItems: "center"
    }
})