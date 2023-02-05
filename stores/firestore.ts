import {defineStore} from 'pinia';
import {doc2MainCategory, MainCategory} from "~/model/MainCategory";
import {doc2SubCategory, SubCategory} from "~/model/SubCategory";
import {doc2ChadoContent, ChadoContent} from "~/model/ChadoContent";
import {collection, doc, Firestore, getDoc, getDocs, onSnapshot, orderBy, query} from "@firebase/firestore";
import {State} from "vscode-languageclient";

export const firestore = defineStore('firestore_store', {
    state: () => {
        return {
            main_categories: [] as MainCategory[],
            sub_categories: [] as SubCategory[],
            chado_contents: [] as ChadoContent[]
        }
    },
    getters: {
        get_main_categories: state => state.main_categories,
        get_sub_categories: state => state.sub_categories,
        get_matcha_contents: state => state.chado_contents
    },
    actions: {
        update_main_categories(firestore: Firestore) {
            console.log('update_main_categories', 'start')
            const unsub = onSnapshot(query(collection(firestore, 'MainCate'), orderBy('sort', "asc")), (doc) => {
                if (doc) {
                    this.main_categories = doc.docs.map(doc2MainCategory)
                }
            })

        },
        update_sub_categories(firestore: Firestore) {
            console.log('update_sub_categories', 'start')
            const unsub = onSnapshot(query(collection(firestore, 'SubCate'), orderBy('sort', "asc")), (doc) => {
                if (doc) {
                    this.sub_categories = doc.docs.map(doc2SubCategory)
                }
            })
        },
        update_chado_contents(firestore: Firestore) {
            console.log('update_chado_categories', 'start')

            const unsub = onSnapshot(collection(firestore, 'ChadoContent'), (doc) => {
                if (doc) {
                    this.chado_contents = doc.docs.map(doc2ChadoContent)
                }
            })
        }
    }
})