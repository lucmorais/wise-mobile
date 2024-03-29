import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as auth from '../services/auth';
import { http } from "../utils/http";
import * as register from '../services/register';

interface User {
    username: string;
    id: number;
    email: string;
    role: string;
}

interface AuthContextProps {
    signed: boolean;
    user: User | null;
    loading: boolean;
    formLogin: boolean;
    reset: boolean;
    deny: boolean;
    error: boolean;
    modificaError(): void;
    modificaReset(): void;
    modificaFormLogin(): void;
    registerIn(nome: string, tipo: string, email: string, telefone: string, senha: string): Promise<void>;
    logIn(email: string, senha: string): Promise<void>;
    logOut(): void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [formLogin, setFormLogin] = useState(true);
    const [reset, setReset] = useState(true);
    const [deny, setDeny] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadStoragedData() {
            const storagedUser = await AsyncStorage.getItem('@Wise:user');
            const storagedToken = await AsyncStorage.getItem('@Wise:token');
            
            if (storagedUser && storagedToken) {
                http.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
                setUser(JSON.parse(storagedUser));
            }
        }

        loadStoragedData();
    }, []);

    function modificaError() {
        error ? setError(false) : setError(true);
    }

    function modificaReset() {
        reset ? setReset(false) : setReset(true);
    }

    function modificaFormLogin() {
        formLogin ? setFormLogin(false) : setFormLogin(true);
    }

    async function registerIn(nome: string, tipo: string, email: string, telefone: string, senha: string) {
        const { data } = await register.default(nome, tipo, email, telefone, senha);
        
        if(data){
            setError(true);
            setTimeout(() => {
                modificaFormLogin();
            }, 5000);
        }
    }

    async function logIn(email: string, senha: string) {
        try {
            setLoading(true);
            const { data } = await auth.default(email, senha);
            
            if (data) {
                setLoading(false);
                setUser(data.user);
                http.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
                await AsyncStorage.setItem('@Wise:user', JSON.stringify(data.user));
                await AsyncStorage.setItem('@Wise:token', data.access_token);
            } else {
                setUser(null);
            }
            
        } catch (error) {
            setLoading(false);
            setUser(null);
            setDeny(true);
            setTimeout(() => {
                setDeny(false);
            }, 5000);
        }
    }

    async function logOut() {
        AsyncStorage.clear().then(() => {
            setUser(null);
        });
    }

    return (
        <AuthContext.Provider 
            value={{
                signed: !!user, 
                user, 
                formLogin: formLogin, 
                loading,
                reset: reset,
                deny: deny,
                error: error,
                modificaError,
                modificaReset,
                modificaFormLogin,
                registerIn,
                logIn,
                logOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

export function useAuth() {
    const context = useContext(AuthContext);

    return context;
}