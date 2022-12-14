import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import {UserContextProvider} from "./context/userContext";
import Register from "./screens/Register";
import EmailVerification from "./screens/EmailVerification";
import Home from "./screens/Home"
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./firebase";
import Loading from "./components/Loading";
import NewMissionDetail from "./screens/NewMissionDetail";
import AvailableMissionDetail from "./screens/AvailableMissionDetail";
import MissionReportDetail from "./screens/MissionReportDetail";
import NewMissionVotePage from "./screens/NewMissionVotePage";
import MissionReportVotePage from "./screens/MissionReportVotePage";
import ImageViewer from "./screens/ImageViewer";
import Profile from "./screens/Profile";
import MakeAnAction from "./screens/MakeAnAction";
import Notifications from "./screens/Notifications";
import CreateTask from "./screens/CreateTask";
import {ModifyTask} from "./screens/ModifyTask";

const Stack = createStackNavigator()

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (res) => {
            if (res?.emailVerified) {
                setUser(res)
                setLoading(false)
            } else {
                setUser(null)
                setLoading(false)
            }
            console.log(`${res?.email} from App.js !`)
        })
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

    if (user) {
        return (
            <NavigationContainer>
                <UserContextProvider>
                    <Stack.Navigator initialRouteName={"Home"}>
                        <Stack.Screen name={"Home"} component={Home} options={{headerShown: false, animationEnabled: false}}/>
                        <Stack.Screen name={"NewMissionDetail"} component={NewMissionDetail} options={{headerShown: false}}/>
                        <Stack.Screen name={"AvailableMissionDetail"} component={AvailableMissionDetail} options={{headerShown: false}}/>
                        <Stack.Screen name={"MissionReportDetail"} component={MissionReportDetail} options={{headerShown: false}}/>
                        <Stack.Screen name={"NewMissionVotePage"} component={NewMissionVotePage} options={{headerShown: false, gestureEnabled: false}}/>
                        <Stack.Screen name={"MissionReportVotePage"} component={MissionReportVotePage} options={{headerShown: false, gestureEnabled: false}}/>
                        <Stack.Screen name={"ImageViewer"} component={ImageViewer} options={{headerShown: false}}/>
                        <Stack.Screen name={"Profile"} component={Profile} options={{headerShown: false}}/>
                        <Stack.Screen name={"MakeAnAction"} component={MakeAnAction} options={{headerShown: false, animationEnabled: false}}/>
                        <Stack.Screen name={"Notifications"} component={Notifications} options={{headerShown: false, animationEnabled: false}}/>
                        <Stack.Screen name={"CreateTask"} component={CreateTask} options={{headerShown: false, gestureEnabled: false}}/>
                        <Stack.Screen name={"ModifyTask"} component={ModifyTask} options={{headerShown: false, gestureEnabled: false}}/>
                    </Stack.Navigator>
                </UserContextProvider>
            </NavigationContainer>
        )
    }

    return (
        <NavigationContainer>
            <UserContextProvider>
                <Stack.Navigator initialRouteName={"Landing"}>
                    <Stack.Screen name={"Landing"} component={Landing} options={{headerShown: false}}/>
                    <Stack.Screen name={"Login"} component={Login} options={{headerShown: false}}/>
                    <Stack.Screen name={"Register"} component={Register} options={{headerShown: false}}/>
                    <Stack.Screen name={"EmailVerification"} component={EmailVerification} options={{headerShown: false, gestureEnabled: false}}/>
                </Stack.Navigator>
            </UserContextProvider>
        </NavigationContainer>
    )
}