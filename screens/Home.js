import {Button, SafeAreaView, Text} from "react-native";
import TopTab from "../components/TopTab";
import {useUserContext} from "../context/userContext";


export default function Home({navigation}) {
    const {user, logoutUser} = useUserContext()
    return (
        <>
            <TopTab navigation={navigation}/>
            <SafeAreaView>
                <Text>{user?.displayName}</Text>
                <Text>{user?.email}</Text>
                <Button
                    title={"Se déconnecter"}
                    onPress={() => {
                        logoutUser()
                    }}
                />
            </SafeAreaView>
        </>
    )
}