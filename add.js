const knex = require('./knex.js');
const knex2 = require('./knex2.js');

async function  addNext () {
    console.log("addNext");
    let productInfo = await knex('products')
        .whereNull('added_id')
        .whereNotNull('product')
        .first();

    // console.log(productInfo.url);
    let product = productInfo.product;
    // console.log(product);
    if (!isValidProduct(product)) {
        console.log(productInfo.url + " NOT OK");
        await knex('products').where('id', productInfo.id).update({added_id: 0})

    } else {
        console.log(productInfo.url + " OK");
        let id = await add(product);
        await knex('products').where('id', productInfo.id).update({added_id: id})
    }
    await addNext();
}

function isValidProduct (product) {
    if (!product.product.image_url) {
        console.log("No image");
        return false;
    }
    return true;
}

async function  add (product) {
    let id = await addProduct(product);
    await addGallery(product, id);
    await addAttributes(product, id);
    return id;
    console.log(id);

}

async function addProduct (product) {
    // console.log(product);
    let code = product.product.code
    // console.log(code);
    let row = await knex2('chi_product').where('code', code).first();
    product.product.status = 'order';
    product.product.create_time = knex.fn.now()
    product.product.attributes = JSON.stringify(product.attributes);
    if (!row) {
        await knex2('chi_product').insert(product.product).onConflict().ignore();
    } else {
        await knex2('chi_product').where('code', code).update(product.product);
    }
    row = await knex2('chi_product').where('code', code).first();
    return row.id;
}

async function addGallery (product, id) {
    // console.log(product.gallery);
    product.gallery.forEach(async (item, i) => {
        await knex2('chi_product_gallery').insert({
            product_id : id,
            image_url : item.image_url,
            create_time : knex.fn.now(),
        }).onConflict().ignore();
    });
}

async function addAttributes (product, id) {
    // console.log(product);
}

addNext();
