import {Image, TouchableOpacity, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import createTaskOutlined from "../assets/images/createtask-outlined.png"


export default function BottomTab({navigation}) {
    return (
        <View
            style={{
                backgroundColor: "white",
                height: 55,
                width: "100%",
                borderTopWidth: 0.5,
                borderColor: "#959595",
            }}
        >

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "100%",
                    width: "100%"
                }}
            >
                <TouchableOpacity style={{marginLeft: 10}} onPress={() => navigation.navigate("Home")}>
                    <Ionicons
                        name={"home"}
                        size={30}
                        color={"black"}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={{}}>
                    <Image
                        source={createTaskOutlined}
                        style={{height: 30, width: 30}}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={{marginRight: 10}}>
                    <Ionicons
                        name={"notifications-outline"}
                        size={30}
                        color={"black"}
                    />
                </TouchableOpacity>

            </View>

        </View>
    )
}