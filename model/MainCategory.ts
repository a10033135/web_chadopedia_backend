import firebase from "firebase/compat";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

export class MainCategory {
  id: string = '';
  title: string = '';
  desc: string = '';

  enable: boolean = false;

  image_url: string = '';

  create_time: number = 0;

  update_time: number = 0;

  constructor(id: string, title: string, desc: string, enable: boolean, image_url: string, create_time: number, update_time: number) {
    this.id = id
    this.title = title
    this.desc = desc
    this.enable = enable
    this.image_url = image_url
    this.create_time = create_time
    this.update_time = update_time
  }
}

export function doc2MainCategory(doc: QueryDocumentSnapshot): MainCategory {
  const data = doc.data()
  console.log(doc)
  console.log(data)
  const id = doc.id ?? ''
  const title = data['title'] ?? ''
  const desc = data['desc'] ?? ''
  const enable = data['enable'] ?? false
  const image_url = data['image_url'] ?? ''
  // const create_time = data['create_time'].seconds ?? 0
  // const update_time = data['update_time'].seconds ?? 0
  // return new MainCategory(id, title, desc, enable, image_url, create_time, update_time)
  return new MainCategory(id, title, desc, enable, image_url, 0, 0)

}
