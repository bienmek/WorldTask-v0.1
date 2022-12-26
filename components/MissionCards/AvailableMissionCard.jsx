import {Text, View, StyleSheet, TouchableOpacity, Dimensions, Image} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageSwap from "./ImageSwap";
import star1 from "../../assets/images/star_1.png";
import star2 from "../../assets/images/star_2.png";
import star3 from "../../assets/images/star_3.png";
import star4 from "../../assets/images/star_4.png";
import star5 from "../../assets/images/star_5.png";
import {useUserContext} from "../../context/userContext";
import {useEffect, useState} from "react";

export default function AvailableMissionCard({data, navigation}) {
    const {user, getUserFromDb} = useUserContext()

    const [username, setUsername] = useState("------");

    const chooseStar = (difficulty) => {
        switch(difficulty) {
            case 1:
                return star1
            case 2:
                return star2
            case 3:
                return star3
            case 4:
                return star4
            case 5:
                return star5
            default:
                break
        }
    }

    const formatDate = () => {
        let submitDate
        if (data.creation_date !== null) {
            submitDate = new Date(data.creation_date.seconds*1000)
        } else {
            submitDate = new Date(Date.now())
        }
        const now = new Date(Date.now())
        const diffTime = now.getTime() - submitDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

        if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) {
            return `${diffSeconds} s`
        }
        if (diffDays === 0 && diffHours === 0 && diffMinutes === 1) {
            return `${diffMinutes} min`
        }
        if (diffDays === 0 && diffHours === 0 && diffMinutes > 1) {
            return `${diffMinutes} mins`
        }
        if (diffDays === 0 && diffHours >= 1) {
            return `${diffHours} h`
        }
        if (diffDays >= 1) {
            return `${diffDays} j`
        }
    }

    useEffect(() => {
        getUserFromDb(data.creator).then((res) => {
            res.forEach((doc) => {
                const user = doc.data()
                setUsername(user.username)
            })
        })
    }, [data,])

    return (
        <TouchableOpacity
            style={{
                width: "100%",
                backgroundColor: "white",
                marginTop: 3,
                borderWidth: 0.5,
                borderColor: "#959595"
            }}
            onPress={() =>
                navigation.navigate("AvailableMissionDetail", {
                    missionData: data,
                    star: chooseStar(data.difficulty),
                    readOnly: false
                })}
            activeOpacity={0.7}
        >
            <View
                style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    width: "100%",
                    padding: 5,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "100%",
                        flexWrap: "wrap"
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 18,
                        }}
                    >
                        {data.title}
                    </Text>
                    <Text style={styles.sideText}>@{username} · {formatDate()}</Text>
                </View>

                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start"
                    }}
                >
                    <View style={styles.downSide}>
                        <Ionicons
                            name={"location-outline"}
                            size={20}
                            color={"black"}
                        />
                        <TouchableOpacity>
                            <Text style={styles.locationText}>{data.location.streetNumber} {data.location.streetName}, {data.location.city}</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Image
                            source={chooseStar(data.difficulty)}
                            style={{width: 50, height: 50}}
                        />
                    </View>
                </View>


            </View>
            <ImageSwap
                images={data.images}
                imageHeight={300}
                imageMarginTop={10}
                imageIndexMarginTop={20}
                navigation={navigation}
            />

            <View style={styles.bottomSide}>
                <View style={styles.commentBubble}>
                    <FontAwesome
                        name={"comment-o"}
                        size={30}
                        color={"black"}
                    />
                    <Text style={{marginLeft: 5, fontSize: 18, fontWeight: "bold"}}>{data.comments.length}</Text>
                </View>

                <View
                    style={{
                        flex: 1,
                        backgroundColor: "#25995C",
                        height: 40,
                        width: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 20
                    }}
                >
                    <Text style={{color: "white", fontSize: 18}}>Choisir la task</Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 0.5
                    }}
                >
                    <Ionicons
                        name={"share-outline"}
                        size={30}
                        color={"black"}
                    />
                    <Text style={{marginLeft: 5, fontSize: 18, fontWeight: "bold"}}>{data.shares.length}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        height: 400,
        width: "100%",
        backgroundColor: "white",
        marginTop: 3,
        borderWidth: 0.5,
        borderColor: "#959595"
    },
    header: {
        flexDirection: "column",
        marginTop: 8,
        marginLeft: 5
    },
    title: {
        fontWeight: "bold",
        fontSize: 18
    },
    sideText: {
        color: "#959595",
        fontSize: 11,
        marginLeft: 4,
        marginTop: 3
    },
    upSide: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    downSide: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 3
    },
    locationText: {
        color: "#25995C",
        fontSize: 13,
        marginLeft: 3,
        textDecorationLine: "underline"
    },
    bottomSide: {
        height: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    commentBubble: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flex: 0.5
    }
})