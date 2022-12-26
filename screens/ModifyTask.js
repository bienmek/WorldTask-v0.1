import {ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, Image} from "react-native";
import SideMenu from "../components/SideMenu";
import TopTab from "../components/TopTab";
import {useEffect, useState} from "react";
import BottomTab from "../components/BottomTab";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Location from "expo-location";
import {getAddress} from "../functions/geo-location";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {db, storage} from "../firebase";
import {manipulateAsync, SaveFormat} from "expo-image-manipulator";
import {useFonts} from "expo-font";
import {addDoc, collection, doc, serverTimestamp, updateDoc} from "firebase/firestore";
import {useUserContext} from "../context/userContext";


export function ModifyTask({navigation, route}) {
    const {routeTask} = route.params

    const {user} = useUserContext()

    const [displayMenu, setDisplayMenu] = useState(false);
    const [taskInfo, setTaskInfo] = useState({title: routeTask.title, description: routeTask.description});
    const [images, setImages] = useState(routeTask.images);
    const [location, setLocation] = useState(null);
    const [error, setError] = useState("");
    const [publishingTask, setPublishingTask] = useState(false);
    const [showModifyTask, setShowModifyTask] = useState(false);

    const [loaded] = useFonts({
        introScript: require('../assets/font/intro-script-demo-medium.otf'),
    });

    useEffect(() => {
        getUserLocation()
    }, [])

    const getUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocation('denied')
            return
        }

        Location
            .getCurrentPositionAsync({})
            .then((res) => {
                getAddress(res.coords.latitude, res.coords.longitude)
                    .then((res) => setLocation(res))
            })
    }

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

    const compressImage = async (image) => {
        const ratio = Math.min(1920 / image.width, 1080 / image.height);
        return await manipulateAsync(
            image.uri,
            [{resize: {height: image.height*ratio, width: image.width*ratio}}],
            {compress: 0.5, format: SaveFormat.JPEG}
        )
    }

    const onSubmit = async () => {
        setShowModifyTask(false)
        try {
            if (!location) {
                setError('Erreur: attendez la fin de la récupération de vos données de géolocalisation')
                return
            }
            if (location === 'denied') {
                setError('Erreur: Vous devez autoriser la géolocalisation pour pouvoir publier une task:\n(Réglages->WorldTask->position->activer)')
                return
            }
            if (!taskInfo.title) {
                setError('Erreur: Vous devez donner un titre à votre task')
                return
            }
            if (taskInfo.title.length > 30 || taskInfo.title.length < 5) {
                setError("Erreur: le titre doit être compris entre 5 et 30 caractères maximum")
                return
            }
            if (!taskInfo.description) {
                setError('Erreur: Vous devez donner une description à votre task')
                return
            }
            if (taskInfo.description.length > 600 || taskInfo.description.length < 20) {
                setError("Erreur: la description doit être comprise entre 20 et 600 caractères maximum")
                return
            }
            if (images.length < 3) {
                setError('Erreur: Vous devez selectionner au moins 3 photos pour pouvoir publier une task')
                return
            }
            if (images.length > 20) {
                setError('Erreur: Vous ne pouvez pas selectionner au delà de 20 photos')
                return
            }
            setError('')
            setPublishingTask(true)
            const imagesUrl = [];
            images.map((image) => {
                if (!image.uri) {
                    imagesUrl.push(image)
                }
            })
            const imagesPromises = images.map((image) => {
                if (image.uri) {
                    const storageRef = ref(storage, `mission_picture/${generateUUID()}`);
                    return compressImage(image.uri && image)
                        .then((compressedImage) => fetch(compressedImage.uri))
                        .then((response) => response.blob())
                        .then((blob) => {
                                const uploadTask = uploadBytesResumable(storageRef, blob)
                                return new Promise((resolve, reject) => {
                                    uploadTask.on("state_changed",
                                        () => console.log(""),
                                        (error) => reject(error),
                                        () => {
                                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                                imagesUrl.push(downloadURL)
                                                resolve();
                                            });
                                        });
                                });
                            }
                        )
                }
            });
            await Promise.all(imagesPromises);
            await updateDoc(doc(db, "new_tasks", routeTask.uid), {
                title: taskInfo.title,
                description: taskInfo.description,
                creation_date: serverTimestamp(),
                location: location,
                images: imagesUrl,
                votes: [],
                hasBeenModified: true
            })
            setPublishingTask(false)
            navigation.navigate("Profile", {routeUser: user.uid})
        } catch (error) {
            console.error(error)
        }
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
            {showModifyTask && (
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
                        onPress={() => setShowModifyTask(false)}
                        activeOpacity={0.7}
                    >
                    </TouchableOpacity>
                    <View
                        style={{
                            backgroundColor: "white",
                            width: "70%",
                            position: "absolute",
                            padding: 20,
                            zIndex: 100,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 20,
                            alignSelf: "center",
                            flexDirection: "column"
                        }}
                    >
                        <Text
                            style={{
                                color: "black",
                                fontSize: 22,
                                textAlign: "center"
                            }}
                        >
                            Êtes-vous sûr de vouloir modifier votre task ?
                        </Text>

                        <Text
                            style={{
                                color: "#959595",
                                fontSize: 15,
                                fontStyle: "italic",
                                textAlign: "center"
                            }}
                        >
                            (La modification de votre task sera irréversible. Vous avez le droit qu'à une seule modification par task.)
                        </Text>

                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 20,
                                width: "70%"
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    width: "100%",
                                    backgroundColor: "red",
                                    borderRadius: 20,
                                    paddingHorizontal: 5,
                                    paddingVertical: 10,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                activeOpacity={0.7}
                                onPress={onSubmit}
                            >
                                <Text style={{color: "white", fontSize: 18}}>
                                    oui
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    width: "100%",
                                    backgroundColor: "#25995C",
                                    borderRadius: 20,
                                    paddingHorizontal: 5,
                                    paddingVertical: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: 5
                                }}
                                activeOpacity={0.7}
                                onPress={() => setShowModifyTask(false)}
                            >
                                <Text style={{color: "white", fontSize: 18}}>
                                    non
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            )}
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>

                    {/*--------Title part--------*/}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%"
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 42,
                                fontFamily: "introScript",
                            }}
                        >
                            Titre
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <TextInput
                            placeholder={"Modifier le titre..."}
                            style={styles.input}
                            onChangeText={(arg) => {
                                let update = {}
                                update = {title: arg}
                                setTaskInfo((prevState) => ({...prevState, ...update}))
                            }}
                            keyboardType={"twitter"}
                            value={taskInfo.title}
                        />
                        <Text
                            style={{
                                marginLeft: 5,
                                fontSize: 16,
                                color: (taskInfo.title.length <= 30 && taskInfo.title.length >= 5) ? "green" : "red",
                                position: "absolute",
                                alignSelf: "flex-end"
                            }}
                        >
                            {taskInfo.title.length} / 30 max
                        </Text>
                    </View>
                    {/*--------Title part--------*/}

                    {/*--------Description part--------*/}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%"
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 42,
                                marginTop: 20,
                                fontFamily: "introScript",
                            }}
                        >
                            Description
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <TextInput
                            placeholder={"Modifier la description..."}
                            style={styles.inputArea}
                            multiline={true}
                            numberOfLines={20}
                            onChangeText={(arg) => {
                                let update = {}
                                update = {description: arg}
                                setTaskInfo((prevState) => ({...prevState, ...update}))
                            }}
                            keyboardType={"twitter"}
                            value={taskInfo.description}
                        />
                        <Text
                            style={{
                                marginLeft: 5,
                                fontSize: 16,
                                color: (taskInfo.description.length <= 600 && taskInfo.description.length >= 20) ? "green" : "red",
                                position: "absolute",
                                alignSelf: "flex-end"
                            }}
                        >
                            {taskInfo.description.length} / 600 max
                        </Text>
                    </View>
                    {/*--------Description part--------*/}

                    {/*--------Photos part--------*/}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%"
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 42,
                                marginTop: 20,
                                fontFamily: "introScript",
                            }}
                        >
                            Photos
                        </Text>
                    </View>

                    {images.length < 1 ? (
                        <View
                            style={{
                                marginTop: 20,
                                marginBottom: 20
                            }}
                        >
                            <PhotoCard
                                setImages={(cbImages) => {
                                    if (cbImages) {
                                        cbImages.map((image) => setImages((prevState) => [...prevState, image]))
                                    }
                                }}
                            />
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{
                                marginTop: 20,
                                marginBottom: 20
                            }}
                        >
                            <PhotoCard
                                setImages={(cbImages) => {
                                    if (cbImages) {
                                        cbImages.map((image) => setImages((prevState) => [image, ...prevState]))
                                    }
                                }}
                            />

                            {images.map((image, index) => (
                                <PhotoCard
                                    tempImage={image.uri ? image.uri : image}
                                    key={index}
                                    navigation={navigation}
                                    deleteImage={(stateImage) => setImages(images.filter((image) => image.uri ? image.uri !== stateImage : image !== stateImage))}
                                />
                            ))}
                        </ScrollView>
                    )}
                    <Text
                        style={{
                            marginLeft: 5,
                            top: -20,
                            fontSize: 16,
                            color: (images.length <= 20 && images.length >= 3) ? "green" : "red",
                            alignSelf: "center"
                        }}
                    >
                        {images.length} / 20 max
                    </Text>
                    {/*--------Photos part--------*/}

                    {/*--------Location part--------*/}
                    {!location ? (
                        <Text
                            style={{
                                color: "#25995C",
                                fontSize: 22,
                                marginTop: 20,
                                marginBottom: 20
                            }}
                        >
                            Géolocalisation en cours...
                        </Text>
                    ) :  location !== 'denied' ? (
                        <View
                            style={{
                                marginTop: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 20
                            }}
                        >
                            <Text style={{color: "#25995C",fontSize: 22}}>
                                {`${location.streetNumber} ${location.streetName}, ${location.city}`}
                            </Text>
                        </View>
                    ) : (<></>)}
                    {/*--------Location part--------*/}

                    {error && (
                        <Text style={{marginTop: 10, color: "red", fontSize: 13}}>{error}</Text>
                    )}

                    {/*--------Submit part--------*/}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setShowModifyTask(true)}
                    >
                        {!publishingTask ? (
                            <Text style={{color: "white", fontSize: 22}}>Modifier la task</Text>
                        ) : (
                            <Text style={{color: "white", fontSize: 22}}>Modification...</Text>
                        )}
                    </TouchableOpacity>
                    {/*--------Submit part--------*/}
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
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: "90%",
        marginTop: 20,
        marginBottom: 20,
        fontSize: 15,
    },
    inputArea: {
        backgroundColor: "white",
        borderColor: "#959595",
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: "90%",
        height: 300,
        marginTop: 20,
        marginBottom: 20,
        fontSize: 15
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

function PhotoCard({tempImage, setImages, deleteImage, navigation}) {
    const pickImage = () => {
        // No permissions request is necessary for launching the images library
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsMultipleSelection: true,
        }).then((res) => {
            if (!res.canceled) {
                console.log(res.assets)
                setImages(res.assets)
            }
        })
    };
    return (
        <>
            {tempImage ? (
                <>
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
                        onPress={() => navigation.navigate("ImageViewer", {routeImage: tempImage})}
                        activeOpacity={0.3}
                    >
                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                height: 40,
                                width: 40,
                                borderRadius: 100,
                                backgroundColor: "white",
                                zIndex: 99,
                                justifyContent: "center",
                                alignItems: "center",
                                alignSelf: "flex-end",
                                top: 0,
                                borderWidth: 2,
                                borderColor: "#959595"
                            }}
                            activeOpacity={0.3}
                            onPress={() => deleteImage(tempImage)}
                        >
                            <MaterialCommunityIcons
                                name={"delete-outline"}
                                size={30}
                                color={"red"}
                            />
                        </TouchableOpacity>

                        <Image
                            source={{uri: tempImage}}
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 18,
                                resizeMode: "cover"
                            }}
                        />

                    </TouchableOpacity>
                </>
            ) : (
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
                    onPress={pickImage}
                >
                    <MaterialIcons
                        name={"add"}
                        size={60}
                        color={"black"}
                    />
                </TouchableOpacity>
            )}
        </>
    )
}