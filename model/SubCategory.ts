import firebase from "firebase/compat";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import {MainCategory} from "~/model/MainCategory";

export class SubCategory {

  id: string = '';

  main_cate_id: string = '';
  title: string = '';
  desc: string = '';
  enable: boolean = false;
  image_url: string = '';
  create_time: number = 0;
  update_time: number = 0;

  constructor(id: string, main_cate_id: string, title: string, desc: string, enable: boolean, image_url: string, create_time: number, update_time: number) {
    this.id = id;
    this.main_cate_id = main_cate_id;
    this.title = title;
    this.desc = desc;
    this.enable = enable;
    this.image_url = image_url;
    this.create_time = create_time;
    this.update_time = update_time;
  }

  static newInstance(): SubCategory {
    return new SubCategory('', '', '', '', false, '', 0, 0)
  }
}

export function doc2SubCategory(doc: QueryDocumentSnapshot): SubCategory {
  const data = doc.data()
  console.log(doc)
  console.log(data)
  const id = doc.id ?? ''
  const main_cate_id = data['main_cate_id'] ?? ''
  const title = data['title'] ?? ''
  const desc = data['desc'] ?? ''
  const enable = data['enable'] ?? ''
  const image_url = data['image_url'] ?? ''
  return new SubCategory(id, main_cate_id, title, desc, enable, image_url, 0, 0)
}
