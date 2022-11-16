import {SafeAreaView, Text, TextInput, View, StyleSheet, TouchableOpacity} from "react-native";
import TopTab from "../components/TopTab";
import {useEffect, useState} from "react";
import {StatusBar} from "expo-status-bar";
import {db} from "../firebase";
import {collection, query, where, getDocs} from "firebase/firestore"
import {useUserContext} from "../context/userContext";

export default function Landing ({navigation}) {
    const [mail, setMail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    const taskers = collection(db, "taskers")
    const {user} = useUserContext()

    const handleOnPress = async () => {
        if (mail && !error) {
            setLoading(true)
            const q = query(taskers, where("email", "==", mail))
            const querySnapshot = await getDocs(q);
            setLoading(false)
            if (querySnapshot.empty) {
                navigation.navigate("Register", {routeMail: mail})
            } else {
                navigation.navigate("Login", {routeMail: mail})
            }
        } else {
            setError("Erreur: Adresse e-mail invalide ou non autorisée.")
        }
    }

    useEffect(() => {
        console.log(user)
        if ((regex.test(mail) === false && mail)) {
            setError("Erreur: Adresse e-mail invalide ou non autorisée.")
        } else {
            setError("")
        }
    }, [mail])

    return (
        <>
            <TopTab navigation={navigation}/>
            <StatusBar backgroundColor={"white"}/>
            <SafeAreaView
                style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "column",
                    marginTop: 44,
            }}
            >
                {loading && (
                    <Text style={{color: "#25995C", fontSize: 15, fontWeight: "bold", textAlign: "center"}}>Chargement...</Text>
                )}

                {error && (
                    <Text style={{marginTop: 10, color: "red", fontSize: 13}}>{error}</Text>
                )}

                <View style={{alignItems: "flex-start", marginTop: 10}}>
                    <Text style={styles.label}>E-mail</Text>

                    <TextInput
                        placeholder={"Entrez votre adresse mail..."}
                        style={styles.input}
                        onChangeText={(mail) => setMail(mail)}
                        autoCorrect={false}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleOnPress}
                    >
                        <Text style={{color: "white", fontSize: 16 ,fontWeight: "bold"}}>
                            Suivant
                        </Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: "white",
        borderColor: "#959595",
        borderWidth: 1,
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        width: 300
    },
    button: {
        width: 300,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#25995C",
        borderRadius: 10,
        marginTop: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    label: {
        fontSize: 15,
        justifyContent: "flex-start",
        marginBottom: 6,
        fontWeight: "bold",
        textAlign: "left"
    }
})