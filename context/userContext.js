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
    const [profilePicture, setProfilePicture] = useState("https://firebasestorage.googleapis.com/v0/b/worldtask-test.appspot.com/o/profile_picture%2Fblank_pp.png?alt=media&token=0c6a438a-6dcf-4491-94d5-c1ee187e6c08");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorContext, setErrorContext] = useState("");
    const [updateContext, setUpdateContext] = useState(0);

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
    }, [updateContext]);


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

    const getUserByUsername = async (username) => {
        const taskers = collection(db, "taskers")
        const q = query(taskers, where("username", "==", username))
        return await getDocs(q)
    }


    const contextValue = {
        user,
        loading,
        errorContext,
        setLoading,
        username,
        profilePicture,
        setUpdateContext,
        updateContext,
        getUserFromDb,
        registerUser,
        loginUser,
        logoutUser,
        forgotPassword,
        sendEmail,
        getUserByUsername
    }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}