import {QueryDocumentSnapshot, Timestamp} from "@firebase/firestore";

export class ChadoContent {

    id: string = '';

    title: string = '';

    desc: string = '';

    enable: boolean = false;

    has_image: boolean = false;

    main_categories: string[] = [];

    sub_categories: string[] = [];

    create_time: number = 0;

    update_time: number = 0;


    constructor(id: string, title: string, desc: string, enable: boolean, has_image: boolean, main_categories: string[], sub_categories: string[], create_time: number, update_time: number) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.enable = enable;
        this.has_image = has_image;
        this.main_categories = main_categories;
        this.sub_categories = sub_categories;
        this.create_time = create_time;
        this.update_time = update_time;
    }

    static newInstance(): ChadoContent {
        return new ChadoContent('', '', '', false, false, [], [], 0, 0)
    }
}

export function doc2ChadoContent(doc: QueryDocumentSnapshot): ChadoContent {
    const data = doc.data()
    const id = doc.id ?? ''
    const title = data['title'] ?? ''
    const desc = data['desc'] ?? ''
    const enable = data['enable'] ?? false
    const image_url = data['has_image'] ?? false
    const main_categories = data['main_categories'] ?? ([] as string[])
    const sub_categories = data['sub_categories'] ?? ([] as string[])
    const create_time = (data['create_time'] as Timestamp).seconds ?? Timestamp.now().seconds
    const update_time = (data['update_time'] as Timestamp).seconds ?? Timestamp.now().seconds
    return new ChadoContent(id, title, desc, enable, image_url, main_categories, sub_categories, create_time, update_time)
}
