import {SafeAreaView, Text, View} from "react-native";
import introscript from "../assets/font/intro-script-demo-medium.otf"

export default function Loading() {
    return (
        <SafeAreaView style={{justifyContent: "center", alignItems: "center", width: "100%", height: "100%"}}>
            <Text style={{fontWeight: "bold", fontSize: 26, fontFamily: "sans-serif-thin" }}>Chargement...</Text>
        </SafeAreaView>
    )
}