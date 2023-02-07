import {v2 as Cloudinary} from 'cloudinary';
import {parse} from 'path'

export default defineEventHandler(async (event) => {

    const {name, path, file} = await readBody(event)

    const cloudinaryConfig = {
        cloud_name: "di0d7y9qa",
        api_key: "377943481171131",
        api_secret: "xnDL2jegPU8DGP9A-vUKs-8MfuE",
        secure: true
    }

    Cloudinary.config(cloudinaryConfig)

    try {
        const result = await Cloudinary.uploader.upload(file, {public_id: name, folder: path})
        console.log(result)
    } catch (e) {
        console.log(e)
    }

    return {
        statusCode: 200,
    }
})