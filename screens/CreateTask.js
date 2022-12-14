import {useState} from "react";
import SideMenu from "../components/SideMenu";
import TopTab from "../components/TopTab";
import {ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import BottomTab from "../components/BottomTab";
import {useFonts} from "expo-font";
import {useUserContext} from "../context/userContext";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";


export default function CreateTask({navigation}) {
    const {user} = useUserContext()

    const [displayMenu, setDisplayMenu] = useState(false);
    const [taskInfo, setTaskInfo] = useState({title: '', description: '', images: [], coordinates: ''});
    const [tempProfilePicture, setTempProfilePicture] = useState("");
    const [image, setImage] = useState(null);

    const [loaded] = useFonts({
        introScript: require('../assets/font/intro-script-demo-medium.otf'),
    });

    const onSubmit = () => {
        console.log(taskInfo)
    }

    if (!loaded) {
        return null;
    }

    return (
        <>
            {displayMenu && (
                <SideMenu displayMenu={(state) => setDisplayMenu(state)} navigation={navigation}/>
            )}
            <TopTab navigation={navigation} displayMenu={(state) => setDisplayMenu(state)}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text
                        style={{
                            fontSize: 36,
                            fontFamily: "introScript",
                        }}
                    >
                        Titre
                    </Text>
                    <TextInput
                        placeholder={"Donnez un titre à la mission..."}
                        style={styles.input}
                        onChangeText={(arg) => {
                            let update = {}
                            update = {title: arg}
                            setTaskInfo((prevState) => ({...prevState, ...update}))
                        }}
                        keyboardType={"twitter"}
                    />

                    <Text
                        style={{
                            fontSize: 36,
                            marginTop: 20,
                            fontFamily: "introScript",
                        }}
                    >
                        Description
                    </Text>
                    <TextInput
                        placeholder={"Donnez une description à la mission..."}
                        style={styles.inputArea}
                        multiline={true}
                        numberOfLines={10}
                        onChangeText={(arg) => {
                            let update = {}
                            update = {description: arg}
                            setTaskInfo((prevState) => ({...prevState, ...update}))
                        }}
                        keyboardType={"twitter"}
                    />

                    <Text
                        style={{
                            fontSize: 36,
                            marginTop: 20,
                            fontFamily: "introScript",
                        }}
                    >
                        Photos
                    </Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{
                            width: "50%"
                        }}
                    >
                        <PhotoCard/>
                    </ScrollView>


                    <TouchableOpacity
                        style={styles.button}
                        onPress={onSubmit}
                    >
                        <Text style={{color: "white", fontSize: 22}}>
                            Publier la mission
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
            <BottomTab navigation={navigation} />
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: 15,
        marginBottom: 15
    },
    input: {
        backgroundColor: "white",
        borderColor: "#959595",
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: "80%",
        marginTop: 5
    },
    inputArea: {
        backgroundColor: "white",
        borderColor: "#959595",
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: "80%",
        height: 250,
        marginTop: 5
    },
    button: {
        width: "80%",
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: "#25995C",
        borderRadius: 20,
        marginTop: 15,
        justifyContent: "center",
        alignItems: "center"
    },
})

function PhotoCard() {
    return (
        <TouchableOpacity
            style={{
                backgroundColor: "white",
                borderWidth: 2,
                borderColor: "#95959595",
                height: 300,
                width: 180,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 5
            }}
        >
            <MaterialIcons
                name={"add"}
                size={60}
                color={"black"}
            />
        </TouchableOpacity>
    )
}