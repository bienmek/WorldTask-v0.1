import {createContext, useContext, useEffect, useState} from "react";
import {auth, db} from "../firebase";

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendEmailVerification
} from "firebase/auth";
import {collection, getDocs, query, where} from "firebase/firestore";

const UserContext = createContext({})

export const useUserContext = () => useContext(UserContext)

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [profilePicture, setProfilePicture] = useState("https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/profile-picture%2Fblank_pp.png?alt=media&token=f3a7e038-17f6-47f4-a187-16cf7c188b05");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorContext, setErrorContext] = useState("");

    useEffect(() => {
        setLoading(true);
        return onAuthStateChanged(auth, (res) => {
            if (res) {
                setUser(res);
                getUserFromDb(res?.uid).then((res) => {
                    res?.forEach((doc) => {
                        setProfilePicture(doc.data().profilePicture)
                        setUsername(doc.data().username)
                    })
                })
            } else {
                setUser(null);
            }
            setErrorContext("")
            setLoading(false);
        });
    }, []);


    const registerUser = (email, password) => {
        setLoading(true);
        const username = email.split("@")[0]
        createUserWithEmailAndPassword(auth, email, password)
            .then(() =>
                updateProfile(auth.currentUser, {
                    displayName: username
                })
            )
            .then(() => {
                sendEmailVerification(auth.currentUser, {
                    handleCodeInApp: true,
                    url: "https://worldtask-test.firebaseapp.com"
                })
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }

    const loginUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logoutUser = () => {
        signOut(auth)
    }

    const forgotPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    }

    const sendEmail = () => {
        setLoading(true)
        sendEmailVerification(auth.currentUser, {
            handleCodeInApp: true,
            url: "https://worldtask-test.firebaseapp.com"
        })
            .then(() => setLoading(false))
            .catch((err) => console.error(err))
    }

    const getUserFromDb = async (uid) => {
        const taskers = collection(db, "taskers")
        const q = query(taskers, where("uid", "==", uid))
        return await getDocs(q)
    }


    const contextValue = {
        user,
        loading,
        errorContext,
        setLoading,
        username,
        profilePicture,
        getUserFromDb,
        registerUser,
        loginUser,
        logoutUser,
        forgotPassword,
        sendEmail
    }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}