import {Image, SafeAreaView, Text, View} from "react-native";
import introscript from "../assets/font/intro-script-demo-medium.otf"
import {useFonts} from "expo-font";
import feuille from "../assets/top-tab/feuille.png";

export default function Loading() {
    const [loaded] = useFonts({
        introScript: require('../assets/font/intro-script-demo-medium.otf'),
    });

    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaView
            style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                flexDirection: "row"
            }}
        >
            <Text
                style={{
                    fontWeight: "bold",
                    fontSize: 42,
                    fontFamily: "introScript",
                    marginBottom: 10
                }}
            >
                World Task
            </Text>

            <Image
                source={feuille}
                style={{
                    marginLeft: 10,
                    marginBottom: 5,
                    width: 50,
                    height: 56,
                    resizeMode: "contain",
                    transform: [{rotateZ: "20deg"}]
                }}
            />
        </SafeAreaView>
    )
}