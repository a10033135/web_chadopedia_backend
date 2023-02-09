import {v2 as Cloudinary} from 'cloudinary'
import {useRuntimeConfig} from "#app";

import {Timestamp} from "@firebase/firestore";
import {Sha1} from "~/utils/sha1";


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

import * as crypto from "crypto";
import CryptoES from 'crypto-es';
// @ts-ignore
import hexSha1 from "hex-sha1/src/hex-sha1.mjs";

// @ts-ignore


export async function uploadImage(file: string) {
    const config = await useRuntimeConfig()

    console.log(config.public)

    const public_id = 'sample_image'
    const timestamp = Timestamp.now().seconds
    const text = `public_id=${public_id}&timestamp=${timestamp}${config.public.cloudinary.apiSecret}`
    console.log(text)
    console.log(Timestamp.now().seconds)

    const textEncode = await new TextEncoder('utf-8').encode('text')
    // await crypto.subtle.digest('SHA-1', textEncode)
    // const unit = Uint8Array.from(text.split('').map(letter => letter.charCodeAt(0)));
    // hexSha1(unit)

    const cry = new Sha1()
    cry.update(textEncode)
    cry.hash()
    const hex = cry.hexDigest()
    console.log(hex)

    // const cloudName = 'di0d7y9qa'
    const body = new FormData()
    body.append('file', file)
    body.append('api_key', config.public.cloudinary.apiKey)
    body.append('public_id', 'sample_image')
    body.append('timestamp', '1675936970')
    body.append('signature', '0a015fddd5503266dd6b8614bf21dc0d93f41ba8')
    console.log(body)
    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${config.public.cloudinary.cloudName}/image/upload`,
        {
            method: "POST",
            body: body,
        }
    );
    const data = await res.json();
    console.log(data)
}