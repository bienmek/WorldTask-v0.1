import {createContext, useContext, useEffect, useState} from "react";
import {auth} from "../firebase";

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendEmailVerification
} from "firebase/auth";

const UserContext = createContext({})

export const useUserContext = () => useContext(UserContext)

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorContext, setErrorContext] = useState("");

    useEffect(() => {
        setLoading(true);
        return onAuthStateChanged(auth, (res) => {
            if (res) {
                setUser(res);
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
                    displayName: username,
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

    const contextValue = {
        user,
        loading,
        errorContext,
        setLoading,
        registerUser,
        loginUser,
        logoutUser,
        forgotPassword
    }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}