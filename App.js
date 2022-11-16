import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import {UserContextProvider, useUserContext} from "./context/userContext";
import Register from "./screens/Register";
import EmailVerification from "./screens/EmailVerification";
import Home from "./screens/Home"
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./firebase";
import Loading from "./components/Loading";

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
                        <Stack.Screen name={"Home"} component={Home} options={{headerShown: false}}/>
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
                    <Stack.Screen name={"EmailVerification"} component={EmailVerification} options={{headerShown: false}}/>
                </Stack.Navigator>
            </UserContextProvider>
        </NavigationContainer>
    )
}