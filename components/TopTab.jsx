import {View, StyleSheet, Image, TouchableOpacity} from "react-native";
import feuille from "../assets/top-tab/feuille.png"
import arrow from "../assets/top-tab/arrow-thin.png"

export default function TopTab({navigation}) {
    return (
        <View style={styles.tab}>
            {navigation.canGoBack() && (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        position: "absolute",
                        marginTop: 30,
                        marginLeft: 10,
                    }}
                >
                    <Image
                        source={arrow}
                        style={{
                            width: 20,
                            height: 20,
                            resizeMode: "contain",
                            transform: [{rotateZ: "90deg"}]
                        }}
                    />
                </TouchableOpacity>
            )}
            <Image
                source={feuille}
                style={{
                    position: "absolute",
                    marginTop: 15,
                    marginLeft: 163,
                    width: 50,
                    height: 56,
                    resizeMode: "contain",
                    transform: [{rotateZ: "20deg"}]
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    tab: {
        height: 65,
        backgroundColor: "white",
        borderBottomWidth: 0.5,
        borderBottomColor: "#959595",
    }
})