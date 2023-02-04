import firebase from "firebase/compat";
import {connectAuthEmulator, getAuth} from "@firebase/auth";
import {connectFirestoreEmulator, getFirestore} from "@firebase/firestore";


export default defineNuxtPlugin((nuxtApp) => {
    const firebaseConfig = {
        apiKey: 'AIzaSyAkcPGQJYUKayLiq92XSe21_e4JrMoGHsM',
        authDomain: 'chadopedia.firebaseapp.com',
        databaseURL: 'https://chadopedia-default-rtdb.firebaseio.com',
        projectId: 'chadopedia',
        storageBucket: 'chadopedia.appspot.com',
        messagingSenderId: '292955403698',
        appId: '1:292955403698:web:14afada992e74a6235a0ab',
        measurementId: 'G-GZ35JTJLRF'
    }

    const firebaseApp = firebase.initializeApp(firebaseConfig)

    const fireAuth = getAuth(firebaseApp)
    // connectAuthEmulator(fireAuth, 'http://127.0.0.1:9099')

    const firestore = getFirestore(firebaseApp)
    // if (!firestore._settingsFrozen) {
    //     connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
    // }


    return {
        provide: {
            fireApp: firebaseApp,
            firestore: firestore,
            fireAuth: fireAuth
        }
    }
});