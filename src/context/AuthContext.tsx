import { getCurrentUser } from "@/lib/appwrite/api"
import { IUser } from "@/types"
import React, { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// create a state for the initial user
// it should be empty since no account has been logged in previously
export const ç = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: ''
} 

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

const AuthProvider = ({ children } : { children: React.ReactNode }) => {
    const [ user, setUser ] = useState<IUser>(INITIAL_USER)
    const [ isLoading, setLoading ] = useState(false)
    const[ isAuthenticated, setIsAuthenticated ] = useState(false)

    const navigate = useNavigate()

    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser()

            if(currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio
                })

                setIsAuthenticated(true)

                return true
            }

            return false
        } catch (error) {
            console.log(error);
            return false
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(
            localStorage.getItem('cookieFallback') === '[]' ||
            localStorage.getItem('cookieFallback') === null
            ) navigate('/sign-in')

            checkAuthUser()
    }, [])

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    }

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useUserContext = () => useContext(AuthContext)