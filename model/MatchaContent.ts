import firebase from "firebase/compat";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

export class MatchaContent {

  id: string = '';

  title: string = '';

  desc: string = '';

  enable: boolean = false;

  image_url: string = '';

  categories: ContentCategory[] = []

  create_time: number = 0;

  update_time: number = 0;

  constructor(id: string, title: string, desc: string, enable: boolean, image_url: string, categories: ContentCategory[], create_time: number, update_time: number) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.enable = enable;
    this.image_url = image_url;
    this.categories = categories;
    this.create_time = create_time;
    this.update_time = update_time;
  }
}

export class ContentCategory {
  main_cat_id: string = ''
  main_cat_title: string = ''
  sub_cat_id: string = ''
  sub_cat_title: string = ''

  constructor(main_cat_id: string, main_cat_title: string, sub_cat_id: string, sub_cat_title: string) {
    this.main_cat_id = main_cat_id;
    this.main_cat_title = main_cat_title;
    this.sub_cat_id = sub_cat_id;
    this.sub_cat_title = sub_cat_title;
  }
}

export function doc2ContentDetail(doc: QueryDocumentSnapshot): MatchaContent {
  const data = doc.data()
  console.log(doc)
  console.log(data)
  const id = doc.id ?? ''
  const title = data['title'] ?? ''
  const desc = data['desc'] ?? ''
  const enable = data['enable'] ?? false
  const image_url = data['image_url'] ?? ''
  const categories = data['categories'] ?? ([] as ContentCategory[])
  // const create_time = data['create_time'].seconds ?? 0
  // const update_time = data['update_time'].seconds ?? 0
  return new MatchaContent(id, title, desc, enable, image_url, categories, 0, 0)
}
