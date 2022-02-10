const knex = require('./knex.js');
const knex2 = require('./knex2.js');

async function  addNext () {
    console.log("addNext");
    let productInfo = await knex('products')
        .whereNull('added_id')
        .whereNotNull('product')
        .first();

    console.log(productInfo.url);
    let product = productInfo.product;
    console.log(product);
    if (!isValidProduct(product)) {
        console.log(productInfo.url + " NOT OK");
        await knex('products').where('id', productInfo.id).update({added_id: 0})

    } else {
        console.log(productInfo.url + " OK");
        await knex('products').where('id', productInfo.id).update({added_id: 1})
        await add(product);
    }
    addNext();
}

function isValidProduct (product) {
    if (!product.product.image_url) {
        console.log("No image");
        return false;
    }
    return true;
}

async function  add (product) {
    console.log(product);
    let code = product.product.code
    console.log(code);
    let row = await knex2('chi_product').where('code', code).first();
    product.product.create_time = knex.fn.now()
    if (!row) {
        await knex2('chi_product').insert(product.product);
    } else {
        await knex2('chi_product').where('code', code).update(product.product);
    }
    console.log(row);
}

addNext();
