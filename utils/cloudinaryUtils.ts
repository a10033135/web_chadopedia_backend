const chado_content_path = 'chado_content'

const main_category_path = 'main_category'

const sub_category_path = 'sub_category'

export {chado_content_path, main_category_path, sub_category_path}

export function genChadoContentPath(id: string): string {
    return chado_content_path + '/' + id
}

export function genMainCategoryPath(id: string): string {
    return main_category_path + '/' + id
}


export function genSubCategoryPath(id: string): string {
    return sub_category_path + '/' + id
}

