import {Text, TouchableOpacity, View} from "react-native";
import NewMissionCard from "./MissionCards/NewMissionCard";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useUserContext} from "../context/userContext";
import {useEffect, useState} from "react";
import Octicons from "react-native-vector-icons/Octicons";
import {newMissionData} from "../firebase/mission-data-sample";
import AntDesign from "react-native-vector-icons/AntDesign";

export default function OngoingTask ({ongoingTask, ongoingTaskPath, navigation, cbUpdate, showDeleteTask, routeUser, username}) {
    const {user} = useUserContext()
    const [timeLeft, setTimeLeft] = useState({hours: 0, minutes: 0, seconds: 0});
    const [update, setUpdate] = useState(0);
    const [displayMore, setDisplayMore] = useState(false);
    const [viewMore, setViewMore] = useState(false);

    const HOURS_THRESHOLD = 24 // in hours

    const computeTimeLeft = () => {
        const submitDate = new Date(ongoingTask.creation_date.seconds*1000)
        const targetDate = new Date(submitDate.getTime() + 1000*(60*3))
        const now = new Date(Date.now())
        const diffTime = targetDate.getTime() - now.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

        setTimeLeft({
            hours: diffHours + 24*diffDays,
            minutes: diffMinutes,
            seconds: diffSeconds
        })
    }

    const computeVotePercentage = () => {
        if (ongoingTask?.votes?.length > 0) {
            let score = 0
            ongoingTask.votes.map((vote) => {
                if (vote.mission_relevance) {
                    score++
                }
            })
            const percentage =  Math.round((score/ongoingTask.votes.length)*100)
            return {yes: percentage, no: 100-percentage}
        } else {
            return {yes: 0, no: 100}
        }
    }

    const computeDifficulty = () => {
        if (ongoingTask?.votes?.length > 0) {
            let diffSum = 0
            let buff = []
            ongoingTask.votes.map((vote) => {
                if (vote?.missionDifficulty) {
                    diffSum+=Number(vote.missionDifficulty)
                    buff.push(".")
                }
            })
            return Math.floor(diffSum/buff.length)
        }
        return null
    }

    const computeRefusalReason = () => {
        let reasonMap = [];
        let maxReason = null;
        let maxFreq = null
        if (ongoingTask?.votes?.length > 0) {
            ongoingTask.votes.map((vote) => {
                if (vote.reason) {
                    if (!reasonMap.some((item) => (item.reason === vote.reason) || (item.reason === vote.other_precision))) {
                        reasonMap.push({ reason: vote.reason === "Autres" ? vote.other_precision : vote.reason, freq: 1, });
                    } else {
                        let update = [...reasonMap]
                        update[update.findIndex((item) => (item.reason === vote?.reason) || (item.reason === vote?.other_precision))].freq = update[update.findIndex((item) => (item.reason === vote?.reason) || (item.reason === vote?.other_precision))].freq+1
                        reasonMap = update
                    }
                }
            });
            if (reasonMap.length > 0) {
                maxFreq = Math.max(...reasonMap.map((item) => item.freq));
                maxReason = reasonMap.filter((item) => item.freq === maxFreq)[0].reason;
                reasonMap.sort((a, b) => a.freq + b.freq);
            }
        }
        return {maxReason: maxReason, maxFreq: maxFreq, reasonMap: reasonMap};
    };

    useEffect(() => {
        if(ongoingTask) {
            computeTimeLeft()
            delay(800)
                .then(() => {
                    setUpdate(update+1)
                })
        }
    }, [update, cbUpdate])

    const delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    return (
        <>
            {ongoingTask ? (
                <>
                    {ongoingTask.creator === user?.uid && (
                        <TouchableOpacity
                            style={{
                                width: "98%",
                                backgroundColor: "#25995C",
                                borderRadius: 20,
                                paddingVertical: 10,
                                marginTop: 3,
                                alignSelf: "center",
                                justifyContent: "flex-start",
                                alignItems: "center"
                            }}
                            onPress={() => setDisplayMore(!displayMore)}
                            activeOpacity={0.7}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    width: "100%"
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 24,
                                        color: "white",
                                        position: "absolute",
                                        left: 20
                                    }}
                                >
                                    {timeLeft.hours}h {timeLeft.minutes}{timeLeft.minutes <= 1 ? "min" : "mins"} {timeLeft.seconds}s
                                </Text>
                                {!ongoingTask.hasBeenModified && (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: "#1f804c",
                                            height: 40,
                                            width: 40,
                                            borderRadius: 100,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginRight: 20,
                                            marginLeft: 20
                                        }}
                                        activeOpacity={0.7}
                                        onPress={() => navigation.navigate("ModifyTask", {routeTask: ongoingTask})}
                                    >
                                        <Octicons
                                            name={"pencil"}
                                            size={25}
                                            color={"white"}
                                        />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#1f804c",
                                        height: 40,
                                        width: 40,
                                        borderRadius: 100,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: 20,
                                        marginLeft: 20
                                    }}
                                    activeOpacity={0.7}
                                    onPress={() => showDeleteTask(true)}
                                >
                                    <MaterialCommunityIcons
                                        name={"delete-outline"}
                                        size={30}
                                        color={"white"}
                                    />
                                </TouchableOpacity>
                            </View>

                            {displayMore ? (
                                <View
                                    style={{
                                        justifyContent: "flex-start",
                                        alignItems: "flex-start",
                                        flexDirection: "column",
                                        width: "90%",
                                        marginTop: 20,
                                        marginBottom: 20,
                                        backgroundColor: "white",
                                        padding: 15,
                                        borderRadius: 20
                                    }}
                                >

                                    <VoteBar votes={ongoingTask.votes} size={"large"}/>

                                    <Text
                                        style={{
                                            color: "#25995C",
                                            fontSize: 18,
                                            marginTop: 30
                                        }}
                                    >
                                        Pour l'instant la task est <Bold text={computeVotePercentage().yes > 50 ? "acceptée" : "refusée"} />
                                    </Text>

                                    <Text
                                        style={{
                                            color: "#25995C",
                                            fontSize: 18,
                                            marginTop: 10
                                        }}
                                    >
                                        Nombre de votants: <Bold text={ongoingTask.votes.length} />
                                    </Text>
                                    {!!computeDifficulty() && (
                                        <Text
                                            style={{
                                                color: "#25995C",
                                                fontSize: 18,
                                                marginTop: 10
                                            }}
                                        >
                                            Difficulté moyenne accordée: <Bold text={`${computeDifficulty()} / 5`}/>
                                        </Text>
                                    )}
                                    {!!computeRefusalReason().maxReason && (
                                        <Text
                                            style={{
                                                color: "#25995C",
                                                fontSize: 18,
                                                marginTop: 10,
                                            }}
                                        >
                                            Principale raison de refus: <Bold text={computeRefusalReason().maxReason} /> ({computeRefusalReason().maxFreq})
                                        </Text>
                                    )}

                                    {!!computeRefusalReason().maxReason && (
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: "#bbbbbb",
                                                opacity: 0.7,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                paddingVertical: 5,
                                                paddingHorizontal: 20,
                                                borderRadius: 20,
                                                alignSelf: "center",
                                                marginTop: 20
                                            }}
                                            activeOpacity={0.7}
                                            onPress={() => setViewMore(!viewMore)}
                                        >
                                            <Text
                                                style={{
                                                    color: "#000000",
                                                    fontSize: 18,
                                                }}
                                            >
                                                {viewMore ? "Voir moins" : "Voir plus"}
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    {viewMore && (
                                        <>
                                            <Text
                                                style={{
                                                    color: "#000000",
                                                    fontSize: 18,
                                                    marginTop: 20
                                                }}
                                            >
                                                Toutes les raisons de refus:
                                            </Text>
                                            {computeRefusalReason().reasonMap.map((reason, index) => (
                                                <Text
                                                    style={{
                                                        color: "#000000",
                                                        fontSize: 18,
                                                        marginTop: 10
                                                    }}
                                                    key={index}
                                                >
                                                    <Bold text={reason.reason}/> ({reason.freq})
                                                </Text>
                                            ))}
                                        </>
                                    )}
                                </View>
                            ) : (
                                <VoteBar votes={ongoingTask.votes} size={"small"}/>
                            )}
                        </TouchableOpacity>
                    )}

                    {ongoingTaskPath === "new_tasks" ? (
                        <NewMissionCard
                            data={ongoingTask}
                            navigation={navigation}
                        />
                    ) : (
                        <></>
                    )}
                </>
            ) : (
                <>
                    {routeUser === user?.uid ? (
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: "black",
                                    marginTop: 20,
                                    marginBottom: 20,
                                    textAlign: "center"
                                }}
                            >
                                Vous n'avez aucune task en cours
                            </Text>

                            <TouchableOpacity
                                style={{
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    width: "45%",
                                    marginTop: 20,
                                    marginBottom: 20
                                }}
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate("Home")}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: "black",
                                        textAlign: "center",
                                        fontStyle: "italic"
                                    }}
                                >
                                    Créez ou {"\n"}choisissez en une !
                                </Text>
                                <AntDesign
                                    name={"arrowright"}
                                    size={40}
                                    color={"black"}
                                />
                            </TouchableOpacity>


                        </View>
                    ) : (
                        <Text
                            style={{
                                fontSize: 18,
                                color: "black",
                                marginTop: 20,
                                marginBottom: 20,
                                textAlign: "center"
                            }}
                        >
                            {username} n'a aucune task en cours
                        </Text>
                    )}
                </>
            )}
        </>
    )
}

function Bold ({text}) {
    return (
        <Text style={{fontWeight: "bold"}}>{text}</Text>
    )
}

function VoteBar ({size, votes}) {
    const computeVotePercentage = () => {
        if (votes?.length > 0) {
            let score = 0
            votes.map((vote) => {
                if (vote.mission_relevance) {
                    score++
                }
            })
            const percentage =  Math.round((score/votes.length)*100)
            return {yes: percentage, no: 100-percentage}
        } else {
            return {yes: 0, no: 100}
        }
    }

    return (
        <View
            style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: size === "small" ? "90%" : "100%",
                position: size === "large" ? "relative" : "absolute",
                bottom: 0,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    height: size === "small" ? 3 : 20,
                    width: "100%",
                }}
            >
                <View
                    style={{
                        backgroundColor: "#004ef5",
                        width: (computeVotePercentage().yes <= 95)  ||  (computeVotePercentage().yes >= 5) ? `${computeVotePercentage().yes}%` :
                            computeVotePercentage().yes < 5 ? "0%" : computeVotePercentage().yes > 95 && "100%",
                        height: "100%",
                        borderTopLeftRadius: 30,
                        borderBottomLeftRadius: 30,
                        borderTopRightRadius: computeVotePercentage().yes > 95 ? 20 : 0,
                        borderBottomRightRadius: computeVotePercentage().yes > 95 ? 20 : 0,
                    }}
                ></View>

                <View
                    style={{
                        backgroundColor: "#d20000",
                        width: (computeVotePercentage().no <= 95)  ||  (computeVotePercentage().no >= 5) ? `${computeVotePercentage().no}%` :
                            computeVotePercentage().no < 5 ? "0%" : computeVotePercentage().no > 95 && "100%",
                        height: "100%",
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        borderTopLeftRadius: computeVotePercentage().no === 100 ? 20 : 0,
                        borderBottomLeftRadius: computeVotePercentage().no === 100 ? 20 : 0,
                    }}
                ></View>
            </View>
            {size === "large" && (
                <View
                    style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        width: "100%",
                    }}
                >
                    <Text style={{color: "#004ef5", fontSize: 18, left: 5}}>{computeVotePercentage().yes}%</Text>
                    <Text style={{color: "#d20000", fontSize: 18, right: 5}}>{computeVotePercentage().no}%</Text>
                </View>
            )}
        </View>
    )
}