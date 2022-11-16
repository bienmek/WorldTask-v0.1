import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import TopTab from "../components/TopTab";
import {useUserContext} from "../context/userContext";
import {useEffect, useState} from "react";
import {setDoc, doc} from "firebase/firestore"
import {db} from "../firebase";

export default function EmailVerification({route, navigation}) {
    const {routeMail, routePassword} = route.params
    const [error, setError] = useState("");
    const {loginUser, user, loading, setLoading} = useUserContext()

    const resendEmail = () => {
        setLoading(true)
        loginUser(routeMail, routePassword)
            .then(async (res) => {
                if (res.user.emailVerified) {
                    await setDoc(doc(db, "taskers", user.uid), {
                        email: user.email,
                        username: user.displayName,
                        stars: 0
                    })
                    navigation.navigate("Home")
                }
                else {
                    setError("Erreur: vous n'avez pas fait vérifier votre adresse e-mail")
                }
            })
            .finally(() => setLoading(false))
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
                    onPress={resendEmail}
                >
                    <Text style={{color: "white", fontSize: 16 ,fontWeight: "bold"}}>
                        Suivant
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
    }
})