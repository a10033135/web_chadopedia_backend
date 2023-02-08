import {QueryDocumentSnapshot, Timestamp} from "@firebase/firestore";

export class MainCategory {
    id: string = '';
    title: string = '';
    desc: string = '';

    enable: boolean = false;

    sort: number = 0;

    has_image: boolean = false;

    create_time: number = 0;

    update_time: number = 0;

    constructor(id: string, title: string, desc: string, enable: boolean, sort: number, has_image: boolean, create_time: number, update_time: number) {
        this.id = id
        this.title = title
        this.desc = desc
        this.enable = enable
        this.sort = sort
        this.has_image = has_image
        this.create_time = create_time
        this.update_time = update_time
    }

    static newInstance(): MainCategory {
        return new MainCategory('', '', '', false, 0, false, 0, 0)
    }
}

export function doc2MainCategory(doc: QueryDocumentSnapshot): MainCategory {
    const data = doc.data()
    const id = doc.id ?? ''
    const title = data['title'] ?? ''
    const desc = data['desc'] ?? ''
    const enable = data['enable'] ?? false
    const sort = data['sort'] ?? 0
    const has_image = data['has_image'] ?? false
    const create_time = (data['create_time'] as Timestamp).seconds ?? Timestamp.now().seconds
    const update_time = (data['update_time'] as Timestamp).seconds ?? Timestamp.now().seconds
    return new MainCategory(id, title, desc, enable, sort, has_image, create_time, update_time)

}
