import {
    Dimensions,
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {useEffect, useState} from "react";
import {useUserContext} from "../context/userContext";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from 'expo-image-picker';
import {db, storage} from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { manipulateAsync, SaveFormat} from "expo-image-manipulator"
import AntDesign from "react-native-vector-icons/AntDesign";


export default function EditProfile({displayEditProfile, profilePicture, updatePage, userBio}) {
    const {user, setUpdateContext, updateContext, getUserByUsername, username, getUserFromDb} = useUserContext()

    const [changedUsername, setChangedUsername] = useState(username);
    const [image, setImage] = useState(null);
    const [tempProfilePicture, setTempProfilePicture] = useState(profilePicture);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [fileName, setFileName] = useState(null);
    const [changedBio, setChangedBio] = useState(userBio);
    const [additionalHeight, setAdditionalHeight] = useState(0 );

    const SCREEN_HEIGHT = Dimensions.get('window').height

    useEffect(() => {
        Keyboard.addListener('keyboardWillShow', () => {
            setAdditionalHeight(230)
        })

        Keyboard.addListener('keyboardWillHide', () => {
            setAdditionalHeight(0)
        })
    }, [Keyboard])

    const pickImage = () => {
        // No permissions request is necessary for launching the image library
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: false
        }).then((res) => {
            console.log(res)
            if (!res.canceled) {
                console.log(res.assets[0].uri)
                setFileName(res.assets[0].fileName)
                manipulateAsync(
                    res.assets[0].uri,
                    [{resize: {height: 850, width: 850}}],
                    { compress: 0.5, format: SaveFormat.JPEG }
                ).then((res) => {
                    console.log("Resized image", res)
                    setImage(res)
                    setTempProfilePicture(res.uri)
                })
            }
        });
    };

    const generateUUID = () => { // Public Domain/MIT
        let d = new Date().getTime();//Timestamp
        let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    function hasConsecutiveLineBreaks(lst) {
        for (let i = 0; i < lst.length - 1; i++) {
            if (lst[i] === '\n' && lst[i + 1] === '\n' && lst[i + 2] === '\n') {
                return true;
            }
        }
        return false;
    }

    const handleOnPress = () => {
        setUploading(true)

        const pfpRef = doc(db, "taskers", user?.uid);
        const regex = /^[a-z\d]+$/i

        if (image) {
            const storageRef = ref(storage, `profile_picture/${generateUUID()}`);
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

        if (changedBio) {
            if (changedBio.length < 5 && changedBio > 300) {
                setError("Erreur: la bio doit être comprise entre 5 et 10 caractères maximum")
                return
            }
            updateDoc(doc(db, "taskers", user.uid), {bio: changedBio.replace(/\n{2,}/g, '\n')})
                .then(() => {
                    if (!image && !changedUsername) {
                        setUploading(false)
                        setUpdateContext(updateContext+1)
                        updatePage(1)
                        displayEditProfile(false)
                    }
                })
        }

        if (changedUsername) {
            if (changedUsername.length > 4 && changedUsername.length < 11) {
                if (regex.test(changedUsername)) {
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
                    setError("Erreur: le nom est invalide")
                }
            } else {
                setUploading(false)
                setError("Erreur: le nom doit être compris entre 5 et 10 caractères maximum")
            }
        } else if (!image) {
            setUploading(false)
        }
    }

    return (
        <View
            style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                flex: 1,
                zIndex: 99,
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <TouchableOpacity
                style={{
                    backgroundColor: "black",
                    opacity: 0.7,
                    height: "100%",
                    width: "100%",
                    zIndex: 99,
                    position: "absolute"
                }}
                onPress={() => !uploading && displayEditProfile(false)}
                activeOpacity={0.7}
            >
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    backgroundColor: "white",
                    width: "90%",
                    position: "absolute",
                    padding: 5,
                    zIndex: 100,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    borderRadius: 20,
                    alignSelf: "center",
                    flexDirection: "column",
                    paddingBottom: additionalHeight
                }}
                activeOpacity={1}
                onPress={() => Keyboard.dismiss()}
            >

                <TouchableOpacity
                    style={{
                        position: "absolute",
                        right: 10,
                        top: 10
                    }}
                    onPress={() => displayEditProfile(false)}
                    activeOpacity={0.7}
                >
                    <AntDesign
                        name={"close"}
                        color={"#959595"}
                        size={30}
                    />
                </TouchableOpacity>

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
                        onChangeText={(username) => setChangedUsername(username)}
                        autoCorrect={false}
                        keyboardType={"twitter"}
                        value={changedUsername}
                    />

                    <Text style={styles.label}>Bio</Text>

                    <TextInput
                        placeholder={"Décrivez vous, donnez les moyens de vous contacter, vos réseaux sociaux, etc..."}
                        style={{
                            backgroundColor: "white",
                            borderColor: "#959595",
                            borderWidth: 1,
                            borderRadius: 10,
                            paddingTop: 10,
                            paddingBottom: 10,
                            paddingLeft: 5,
                            width: "80%",
                            maxHeight: 150,
                            lineHeight: 15
                        }}
                        onChangeText={(bio) => setChangedBio(bio)}
                        autoCorrect={false}
                        multiline={true}
                        keyboardType={"twitter"}
                        value={changedBio}
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
            </TouchableOpacity>
        </View>
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
        marginTop: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    label: {
        fontSize: 18,
        marginBottom: 6,
        marginTop: 10,
        fontWeight: "bold",
        textAlign: "left"
    }
})
