import {QueryDocumentSnapshot, Timestamp} from "@firebase/firestore";

export class SubCategory {

    id: string = '';

    main_cate_id: string = '';
    title: string = '';
    desc: string = '';
    enable: boolean = false;

    sort: number = 0
    image_url: string = '';
    create_time: number = 0;
    update_time: number = 0;

    constructor(id: string, main_cate_id: string, title: string, desc: string, enable: boolean, sort: number, image_url: string, create_time: number, update_time: number) {
        this.id = id;
        this.main_cate_id = main_cate_id;
        this.title = title;
        this.desc = desc;
        this.enable = enable;
        this.sort = sort
        this.image_url = image_url;
        this.create_time = create_time;
        this.update_time = update_time;
    }

    static newInstance(): SubCategory {
        return new SubCategory('', '', '', '', false, 0, '', 0, 0)
    }
}

export function doc2SubCategory(doc: QueryDocumentSnapshot): SubCategory {
    const data = doc.data()
    const id = doc.id ?? ''
    const main_cate_id = data['main_cate_id'] ?? ''
    const title = data['title'] ?? ''
    const desc = data['desc'] ?? ''
    const enable = data['enable'] ?? ''
    const sort = data['sort'] ?? 0
    const image_url = data['image_url'] ?? ''
    const create_time = (data['create_time'] as Timestamp).seconds ?? Timestamp.now().seconds
    const update_time = (data['update_time'] as Timestamp).seconds ?? Timestamp.now().seconds
    return new SubCategory(id, main_cate_id, title, desc, enable, sort, image_url, create_time, update_time)
}
