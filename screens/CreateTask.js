import {useEffect, useRef, useState} from "react";
import SideMenu from "../components/SideMenu";
import TopTab from "../components/TopTab";
import {Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import BottomTab from "../components/BottomTab";
import {useFonts} from "expo-font";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {db, storage} from "../firebase";
import {manipulateAsync, SaveFormat} from "expo-image-manipulator";
import * as Location from 'expo-location';
import {getAddress} from "../functions/geo-location";
import {addDoc, collection, serverTimestamp, updateDoc, doc} from "firebase/firestore";
import {useUserContext} from "../context/userContext";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";


export default function CreateTask({navigation}) {
    const [displayMenu, setDisplayMenu] = useState(false);
    const [taskInfo, setTaskInfo] = useState({title: '', description: ''});
    const [location, setLocation] = useState(null);
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [publishingTask, setPublishingTask] = useState(false);
    const [descPos, setDescPos] = useState(null);
    const [photoPos, setPhotoPos] = useState(null);
    const [showTitleDesc, setShowTitleDesc] = useState(false);
    const [showDescDesc, setShowDescDesc] = useState(false);
    const [showPhotosDesc, setShowPhotosDesc] = useState(false);

    const {user} = useUserContext()

    const [loaded] = useFonts({
        introScript: require('../assets/font/intro-script-demo-medium.otf'),
    });

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

    useEffect(() => {
        getUserLocation()
    }, [])

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
        try {
            if (!location) {
                setError('Erreur: attendez la fin de la r??cup??ration de vos donn??es de g??olocalisation')
                return
            }
            if (location === 'denied') {
                setError('Erreur: Vous devez autoriser la g??olocalisation pour pouvoir publier une task:\n(R??glages->WorldTask->position->activer)')
                return
            }
            if (!taskInfo.title) {
                setError('Erreur: Vous devez donner un titre ?? votre task')
                return
            }
            if (taskInfo.title.length > 30 || taskInfo.title.length < 5) {
                setError("Erreur: le titre doit ??tre compris entre 5 et 30 caract??res maximum")
                return
            }
            if (!taskInfo.description) {
                setError('Erreur: Vous devez donner une description ?? votre task')
                return
            }
            if (taskInfo.description.length > 600 || taskInfo.description.length < 20) {
                setError("Erreur: la description doit ??tre comprise entre 20 et 600 caract??res maximum")
                return
            }
            if (images.length < 3) {
                setError('Erreur: Vous devez selectionner au moins 3 photos pour pouvoir publier une task')
                return
            }
            if (images.length > 20) {
                setError('Erreur: Vous ne pouvez pas selectionner au del?? de 20 photos')
                return
            }
            setError('')
            setPublishingTask(true)
            const imagesUrl = [];
            const imagesPromises = images.map((image) => {
                const storageRef = ref(storage, `mission_picture/${generateUUID()}`);
                return compressImage(image)
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
            });
            await Promise.all(imagesPromises);
            const docRef = await addDoc(collection(db, "new_tasks"), {
                uid: null,
                title: taskInfo.title,
                description: taskInfo.description.replace(/\n{3,}/g, '\n\n'),
                creator: user.uid,
                creation_date: serverTimestamp(),
                location: location,
                images: imagesUrl,
                comments: [],
                shares: [],
                votes: [],
                hasBeenModified: false
            })
            const taskRef = doc(db, "new_tasks", docRef.id)
            const userRef = doc(db, "taskers", user.uid)

            await updateDoc(taskRef, {uid: docRef.id})
            await updateDoc(userRef, {
                ongoing_task: {
                    path: "new_tasks",
                    task_uid: docRef.id
                }
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
            <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={() => {
                    setShowTitleDesc(false)
                    setShowDescDesc(false)
                    setShowPhotosDesc(false)
                }}
                scrollEventThrottle={16}
            >

                <View
                    style={styles.content}
                >
                    {showTitleDesc && (
                        <View
                            style={{
                                top: 0,
                                position: "absolute",
                                zIndex: 99,
                                alignSelf: "center",
                                padding: 10,
                                width: "80%",
                                backgroundColor: "black",
                                opacity: 0.85,
                                borderRadius: 20
                            }}
                            onTouchEnd={() => setShowTitleDesc(false)}
                        >
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 5
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 22,
                                        color: "white",
                                        textDecorationLine: "underline"
                                    }}
                                >
                                    Aide:
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: "white",
                                        marginTop: 6,
                                        lineHeight: 25
                                    }}
                                >
                                    Le titre doit ??tre <Bold text={"clair"}/> et <Bold text={"pr??cis"}/>.
                                    Il doit permettre aux autres d'identifier le mieux ce qu'est votre task en seulement <Bold text={"quelques mots"}/>.
                                    {"\n"}<Text style={{textDecorationLine: "underline"}}>Exemple</Text>: D??chets sur la plage, Plantation d'arbres, etc.
                                </Text>
                            </View>

                        </View>
                    )}

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
                        <TouchableOpacity
                            style={{
                                backgroundColor: "black",
                                height: 30,
                                width: 30,
                                borderRadius: 100,
                                marginLeft: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 0.7
                            }}
                            onPress={() => setShowTitleDesc(true)}
                        >
                            <FontAwesome5
                                name={"question"}
                                size={15}
                                color={"white"}
                            />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <TextInput
                            placeholder={"Ce qui caract??rise le mieux votre task..."}
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

                    {showDescDesc && (
                        <View
                            style={{
                                top: descPos,
                                position: "absolute",
                                zIndex: 99,
                                alignSelf: "center",
                                padding: 10,
                                width: "80%",
                                opacity: 0.85,
                                backgroundColor: "black",
                                borderRadius: 20
                            }}
                            onTouchEnd={() => setShowDescDesc(false)}
                        >
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 10
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 22,
                                        color: "white",
                                        textDecorationLine: "underline"
                                    }}
                                >
                                    Aide:
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: "white",
                                        marginTop: 6,
                                        lineHeight: 25
                                    }}
                                >
                                    La description doit <Bold text={"d??tailler"}/> la task le plus <Bold text={"pr??cisement"}/> possible.
                                    {"\n"}C'est ?? dire: <Bold text={"d??crire"}/> en quoi elle consiste, ce qu'il faut faire lorsque l'on est sur les lieux, <Bold text={"comment s'y prendre"}/>,
                                    quel serait <Bold text={"l'outillage n??cessaire"}/>, <Bold text={"combien de personnes"} /> il faudrait, le temps que ??a pourrait prendre, etc...
                                    {"\n"}N'h??sitez ?? conseiller, ainsi qu'?? indiquer s'il faut une <Bold text={"qualit?? sp??cifique"}/> pour accomplir efficacement la task !
                                </Text>
                            </View>
                        </View>
                    )}


                    {/*--------Description part--------*/}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%"
                        }}
                        onLayout={(event) => {
                            const { x, y } = event.nativeEvent.layout;
                            setDescPos(y);
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
                        <TouchableOpacity
                            style={{
                                backgroundColor: "black",
                                height: 30,
                                width: 30,
                                borderRadius: 100,
                                marginLeft: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 0.7,
                                top: 15
                            }}
                            onPress={() => setShowDescDesc(true)}
                        >
                            <FontAwesome5
                                name={"question"}
                                size={15}
                                color={"white"}
                            />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <TextInput
                            placeholder={"D??crivez la task au maximum..."}
                            style={styles.inputArea}
                            multiline={true}
                            numberOfLines={20}
                            onChangeText={(arg) => {
                                let update = {}
                                update = {description: arg}
                                setTaskInfo((prevState) => ({...prevState, ...update}))
                            }}
                            keyboardType={"twitter"}
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

                    {showPhotosDesc && (
                        <View
                            style={{
                                top: photoPos,
                                position: "absolute",
                                zIndex: 99,
                                alignSelf: "center",
                                padding: 10,
                                width: "80%",
                                backgroundColor: "black",
                                opacity: 0.85,
                                borderRadius: 20
                            }}
                            onTouchEnd={() => setShowPhotosDesc(false)}
                        >
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 10
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 22,
                                        color: "white",
                                        textDecorationLine: "underline"
                                    }}
                                >
                                    Aide:
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: "white",
                                        marginTop: 6,
                                        lineHeight: 25
                                    }}
                                >
                                    Choisissez des photos pour <Bold text={"illustrer"}/> ce que vous avez mis dans la description.
                                    La personne qui choisira la task doit <Bold text={"savoir ?? quoi s'attendre"}/>.
                                    {"\n"}<Text style={{textDecorationLine: "underline"}}>Conseil</Text>: Choisissez au moins 5 photos !
                                </Text>
                            </View>
                        </View>
                    )}


                    {/*--------Photos part--------*/}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%"
                        }}
                        onLayout={(event) => {
                            const { x, y } = event.nativeEvent.layout;
                            setPhotoPos(y);
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
                        <TouchableOpacity
                            style={{
                                backgroundColor: "black",
                                height: 30,
                                width: 30,
                                borderRadius: 100,
                                marginLeft: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 0.7,
                                top: 10
                            }}
                            onPress={() => setShowPhotosDesc(true)}
                        >
                            <FontAwesome5
                                name={"question"}
                                size={15}
                                color={"white"}
                            />
                        </TouchableOpacity>
                    </View>

                    {images.length <= 0 ? (
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
                                    tempImage={image.uri}
                                    key={index}
                                    navigation={navigation}
                                    deleteImage={(stateImage) => setImages(images.filter((image) => image.uri !== stateImage))}
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
                                G??olocalisation en cours...
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
                        onPress={onSubmit}
                    >
                        {!publishingTask ? (
                            <Text style={{color: "white", fontSize: 22}}>Cr??er la task</Text>
                        ) : (
                            <Text style={{color: "white", fontSize: 22}}>Cr??ation...</Text>
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

function Bold ({text}) {
    return (
        <Text style={{fontWeight: "bold"}}>{text}</Text>
    )
}

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