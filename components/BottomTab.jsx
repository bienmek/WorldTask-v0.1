import {Image, TouchableOpacity, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import createTaskOutlined from "../assets/images/createtask-outlined.png"
import createTaskBlack from "../assets/images/pencil_ruler.png"
import {useRoute} from "@react-navigation/native";
import {isIphoneX} from "react-native-iphone-x-helper";


export default function BottomTab({navigation}) {
    const route = useRoute()

    return (
        <View
            style={{
                backgroundColor: "white",
                height: (isIphoneX() ? 70 : 50),
                width: "100%",
                borderTopWidth: 0.5,
                borderColor: "#959595",
            }}
        >

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    height: "100%",
                    width: "100%",
                    marginTop: 10
                }}
            >
                <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() =>  navigation.navigate("Home")}
                >
                    <Ionicons
                        name={(
                            route.name === "MakeAnAction" ||
                            route.name === "CreateTask" ||
                            route.name === "Notifications") ? "home-outline" : "home"}
                        size={30}
                        color={"black"}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("MakeAnAction")}>
                    <Image
                        source={(route.name === "MakeAnAction" || route.name === "CreateTask") ? createTaskBlack : createTaskOutlined}
                        style={{height: 30, width: 30}}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={{marginRight: 10}} onPress={() => navigation.navigate("Notifications")}>
                    <Ionicons
                        name={route.name === "Notifications" ? "notifications" : "notifications-outline"}
                        size={30}
                        color={"black"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}