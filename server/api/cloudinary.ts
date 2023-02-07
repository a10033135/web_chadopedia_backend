import {v2 as Cloudinary} from 'cloudinary';
import {parse} from 'path'

export default defineEventHandler(async (nuxtApp) => {

    const {name, path, file} = await readBody(nuxtApp)

    const filename = parse(name).name

    const cloudinaryConfig = {
        cloud_name: "di0d7y9qa",
        api_key: "377943481171131",
        api_secret: "xnDL2jegPU8DGP9A-vUKs-8MfuE",
        secure: true
    }

    Cloudinary.config(cloudinaryConfig)

    try {
        console.log('file')
        const result = await Cloudinary.uploader.upload(file, {public_id: "olympic_flag___"})
        console.log(result.public_id)
    } catch (e) {
        console.log(e)
    }

    return {
        statusCode: 200,
    }
})