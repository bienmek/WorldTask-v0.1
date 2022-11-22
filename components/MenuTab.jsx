import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {useFonts} from "expo-font";
import {useState} from "react";


export default function MenuTab({selectedMenu}) {
    const [selectState, setSelectState] = useState(0);

    let [fontsLoaded] = useFonts({
        oxygen_regular: require('../assets/font/Oxygen-Regular.ttf'),
        oxygen_bold: require('../assets/font/Oxygen-Bold.ttf'),
        oxygen_light: require('../assets/font/Oxygen-Light.ttf')
    });

    if (!fontsLoaded) {
        return null;
    }
    return(
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: (selectState === 0 ? "#d5d5d5" : "white"),
                        height: "100%",
                        paddingLeft: 10,
                        paddingRight: 10
                    }}
                    onPress={() => {
                        setSelectState(0)
                        selectedMenu(0)
                    }}
                >
                    <Text style={styles.text}>Nouvelles</Text>
                    <Text style={styles.text}>Missions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: (selectState === 1 ? "#d5d5d5" : "white"),
                        height: "100%",
                        paddingLeft: 10,
                        paddingRight: 10
                    }}
                    onPress={() => {
                        setSelectState(1)
                        selectedMenu(1)
                    }}
                >
                    <Text style={styles.text}>Missions</Text>
                    <Text style={styles.text}>disponibles</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: (selectState === 2 ? "#d5d5d5" : "white"),
                        height: "100%",
                        paddingLeft: 10,
                        paddingRight: 10
                    }}
                    onPress={() => {
                        setSelectState(2)
                        selectedMenu(2)
                    }}
                >
                    <Text style={styles.text}>Comptes</Text>
                    <Text style={styles.text}>rendus</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        height: 50,
        backgroundColor: "white",
        marginTop: 3,
        borderWidth: 0.5,
        borderColor: "#959595"
    },
    text: {
        fontFamily: "oxygen_bold"
    }
})