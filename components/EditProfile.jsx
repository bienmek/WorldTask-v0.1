import {Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import SideMenu from "../components/SideMenu";
import TopTab from "../components/TopTab";
import AvailableMissionDetailPart from "../components/MissionDetail/AvailableMissionDetailPart";
import BottomTab from "../components/BottomTab";
import {useState} from "react";
import {useUserContext} from "../context/userContext";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from 'expo-image-picker';
import {db, storage} from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";


export default function EditProfile({displayEditProfile, profilePicture, updatePage}) {
    const {user, setUpdateContext, updateContext, getUserByUsername, username} = useUserContext()

    const [changedUsername, setChangedUsername] = useState("");
    const [image, setImage] = useState(null);
    const [tempProfilePicture, setTempProfilePicture] = useState(profilePicture);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const SCREEN_HEIGHT = Dimensions.get('window').height

    const pickImage = () => {
        // No permissions request is necessary for launching the image library
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        }).then((res) => {
            console.log(res)
            if (!res.canceled) {
                setImage(res.assets[0])
                setTempProfilePicture(res.assets[0].uri)
            }
        });
    };

    const handleOnPress = () => {
        setUploading(true)

        const pfpRef = doc(db, "taskers", user?.uid);

        if (image) {
            const storageRef = ref(storage, `profile_picture/${image.fileName}`);
            fetch(image.uri)
                .then((res) => {
                    res.blob().then((resBlob) => {
                        const uploadTask = uploadBytesResumable(storageRef, resBlob);
                        uploadTask.on("state_changed",
                            () => console.log(""),
                            (error) => console.error("STATE CHANGED HERE", error),
                            () => {
                                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                    console.log(downloadURL)
                                    updateDoc(pfpRef, {profilePicture: downloadURL})
                                        .then(() => {
                                            setUploading(false)
                                            setUpdateContext(updateContext+1)
                                            updatePage(1)
                                            displayEditProfile(false)
                                        })
                                        .catch((error) => console.error(error))
                                });
                            }
                        );
                    })
                })
                .catch((error) => console.error(error))
        } else if (!changedUsername) {
            setUploading(false)
        }

        if (changedUsername) {
            if (changedUsername.length > 4 && changedUsername.length < 16) {
                if(changedUsername !== username) {
                    getUserByUsername(changedUsername).then((res) => {
                        if (!res.empty) {
                            setUploading(false)
                            setError("Erreur: le nom est déjà pris par un autre tasker")
                        } else {
                            updateDoc(pfpRef, {username: changedUsername})
                                .then(() => {
                                    if (!image) {
                                        setUploading(false)
                                        setUpdateContext(updateContext+1)
                                        updatePage(1)
                                        displayEditProfile(false)
                                    }
                                })
                                .catch((error) => console.error(error))
                            setError("")
                        }
                    })
                } else {
                    displayEditProfile(false)
                }
            } else {
                setUploading(false)
                setError("Erreur: le nom doit être compris entre 5 et 15 caractères maximum)")
            }
        } else if (!image) {
            setUploading(false)
        }
    }

    return (
        <>
            <TouchableOpacity
                style={{
                    backgroundColor: "rgba(114,114,114,0.58)",
                    opacity: 0.9,
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    zIndex: 199
                }}
                onPress={() => displayEditProfile(false)}
            >
            </TouchableOpacity>

            <View
                style={{
                    width: "80%",
                    position: "absolute",
                    zIndex: 200,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    backgroundColor: "white",
                    alignSelf: "center",
                    marginTop: SCREEN_HEIGHT/4,
                    borderRadius: 20
                }}
            >

                {uploading && (
                    <Text
                        style={{
                            marginTop: 10,
                            color: "#25995C",
                            fontSize: 15,
                            fontWeight: "bold",
                            textAlign: "center"
                        }}
                    >
                        Enregistrement...
                    </Text>
                )}

                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20
                    }}
                >

                    {!image && (
                        <>
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    zIndex: 99
                                }}
                                onPress={pickImage}
                            >
                                <MaterialIcons
                                    name={"add"}
                                    size={80}
                                    color={"white"}
                                />
                            </TouchableOpacity>

                            <View
                                style={{
                                    position: "absolute",
                                    zIndex: 98,
                                    height: 120,
                                    width: 120,
                                    borderRadius: 100,
                                    backgroundColor: "black",
                                    opacity: 0.4
                                }}
                            >

                            </View>
                        </>
                    )}

                    <Image
                        source={{uri: tempProfilePicture}}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 100,
                            resizeMode: "contain"
                        }}
                    />
                </View>


                <View
                    style={{
                        alignItems: "center",
                        marginTop: 20,
                        width: "100%",
                        marginBottom: 20
                    }}
                >
                    <Text style={styles.label}>Nom</Text>

                    <TextInput
                        placeholder={"Entrez votre nouveau nom..."}
                        style={styles.input}
                        onChangeText={(mail) => setChangedUsername(mail)}
                        autoCorrect={false}
                        keyboardType={"twitter"}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleOnPress}
                    >
                        <Text style={{color: "white", fontSize: 16 ,fontWeight: "bold"}}>
                            Enregistrer
                        </Text>
                    </TouchableOpacity>

                    {error && (
                        <Text
                            style={{
                                marginTop: 10,
                                color: "red",
                                fontSize: 13,
                            }}
                        >
                            {error}
                        </Text>
                    )}

                </View>
            </View>
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
        width: "80%"
    },
    button: {
        width: "80%",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#25995C",
        borderRadius: 10,
        marginTop: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    label: {
        fontSize: 18,
        marginBottom: 6,
        fontWeight: "bold",
        textAlign: "left"
    }
})
