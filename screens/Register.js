import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import TopTab from "../components/TopTab";
import {useEffect, useState} from "react";
import {useUserContext} from "../context/userContext";


export default function Register({route, navigation}) {
    const [registerInfo, setRegisterInfo] = useState({password: '', passwordConfirm: ''});
    const [error, setError] = useState("");
    const { routeMail } = route.params
    const {registerUser, loading} = useUserContext()

    const onSubmit = () => {
        if (!error) {
            registerUser(routeMail, registerInfo.password)
            navigation.navigate("EmailVerification", {routeMail: routeMail, routePassword: registerInfo.password})
        }
    }

    useEffect(() => {
        if (registerInfo.password && registerInfo.password.length < 6) {
            setError("Erreur: Le mot de passe doit avoir au moins 6 caractères")
        } else if (registerInfo.password !== registerInfo.passwordConfirm) {
            setError("Erreur: Les mots de passes ne corespondent pas")
        } else {
            setError("")
        }
    }, [registerInfo])

    return (
        <>
            <TopTab navigation={navigation}/>
            <SafeAreaView
                style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "column",
                    flex: 1,
                    margin: 20
                }}
            >
                <Text style={{fontSize: 36, fontWeight: "bold", textAlign: "center"}}>Bienvenue,</Text>

                {loading && (
                    <Text style={{marginTop: 10, color: "#25995C", fontSize: 15, fontWeight: "bold", textAlign: "center"}}>Chargement...</Text>
                )}

                {error && (
                    <Text style={{marginTop: 10, color: "red", fontSize: 13}}>{error}</Text>
                )}
                <View style={{alignItems: "flex-start", marginTop: 10}}>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={styles.lockedInput}
                        value={routeMail}
                        editable={false}
                    />

                    <Text style={styles.label}>Mot de passe</Text>
                    <TextInput
                        placeholder={"Entrez un mot de passe..."}
                        style={styles.input}
                        onChangeText={(arg) => {
                            let update = {}
                            update = {password: arg}
                            setRegisterInfo((prevState) => ({...prevState, ...update}))
                        }}
                        secureTextEntry
                    />

                    <Text style={styles.label}>Confirmez le mot de passe</Text>
                    <TextInput
                        placeholder={"Confirmez mot de passe..."}
                        style={styles.input}
                        onChangeText={(arg) => {
                            let update = {}
                            update = {passwordConfirm: arg}
                            setRegisterInfo((prevState) => ({...prevState, ...update}))
                        }}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={onSubmit}
                    >
                        <Text style={{color: "white", fontSize: 16 ,fontWeight: "bold"}}>
                            S'inscrire
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    lockedInput: {
        backgroundColor: "white",
        borderColor: "#959595",
        color: "#919191",
        borderWidth: 1,
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        width: 300
    },
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
        marginTop: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    label: {
        fontSize: 15,
        justifyContent: "flex-start",
        marginBottom: 6,
        marginTop: 10,
        fontWeight: "bold",
        textAlign: "left"
    }
})