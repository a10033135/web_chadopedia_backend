import {v2 as Cloudinary} from 'cloudinary'
import {useRuntimeConfig} from "#app";

import {Timestamp} from "@firebase/firestore";
import {SHA1} from 'crypto-js'
import {cloudinary_version} from "~/utils/cookie_utils";


const chado_content_path = 'chado_content'

const main_category_path = 'main_category'

const sub_category_path = 'sub_category'

export {chado_content_path, main_category_path, sub_category_path}

export function genChadoContentPath(id: string): string {
    return `${chado_content_path}/${id}`
}

export function genMainCategoryPath(id: string): string {
    return `${main_category_path}/${id}`
}


export function genSubCategoryPath(id: string): string {
    return `${sub_category_path}/${id}`
}


export async function uploadImage(public_id: string, file: string) {
    const version_cookie = useCookie(cloudinary_version)
    const formData = await genApiFormData(public_id)
    const body = new FormData()
    body.append('file', file)
    body.append('api_key', formData.api_key)
    body.append('public_id', formData.public_id)
    body.append('timestamp', formData.timestamp)
    body.append('signature', formData.signature)
    body.append('invalidate', 'true')
    const res = await fetch(
        `https://api.cloudinary.com/v1_1/di0d7y9qa/image/upload`,
        {
            method: "POST",
            body: body,
        }
    );

    const data = await res.json();
    console.log(data)
    version_cookie.value = data.version
}

export async function destroyImage(public_id: string) {
    const version_cookie = useCookie(cloudinary_version)
    const formData = await genApiFormData(public_id)
    const body = new FormData()
    body.append('api_key', formData.api_key)
    body.append('public_id', formData.public_id)
    body.append('timestamp', formData.timestamp)
    body.append('signature', formData.signature)
    body.append('invalidate', 'true')
    const res = await fetch(
        `https://api.cloudinary.com/v1_1/di0d7y9qa/image/destroy`,
        {
            method: "POST",
            body: body,
        }
    );

    const data = await res.json();
    console.log(data)
    version_cookie.value = data.version
}

async function genApiFormData(public_id: string): Promise<{ public_id: string, api_key: string, timestamp: string, signature: string }> {
    const config = await useRuntimeConfig()
    const api_key = config.public.cloudinary.apiKey
    const timestamp = Timestamp.now().seconds.toString()
    const signature_text = `invalidate=true&public_id=${public_id}&timestamp=${timestamp}${config.public.cloudinary.apiSecret}`
    const signature_sha1 = SHA1(signature_text).toString()
    return {
        public_id: public_id,
        api_key: api_key,
        timestamp: timestamp,
        signature: signature_sha1
    }
}