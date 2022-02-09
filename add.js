const knex = require('./knex.js');
const knex2 = require('./knex2.js');

function add () {
    knex('products')
        .whereNull('added_id')
        .whereNotNull('product')
        .first()
        .then(function (result) {
            var crawlId = result.id;
            var productData = result.product.product;
            productData.create_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
            knex2('chi_product').insert(productData).then(function (id) {
                var galleryData = result.product.gallery;
                galleryData.forEach((element, index) => {
                    galleryData[index].product_id = id[0]
                });


                knex2('chi_product_gallery').insert(galleryData).then(function (id) {
                    var brandData = result.product.brand;
                    knex2('chi_manufacture').where('slug', brandData.slug).first().then(function(response){
                        if (!response) {
                            knex2('chi_manufacture').insert(brandData).then(function (result){
                                console.log('kien',crawlId);
    
                                knex('products').where('id', crawlId).update({
                                    added_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                                    added_id: id[0]
                                }).then(function (response) {
                                    console.log(response);
                                    add();
                                })
                            });
                        } else {
                            knex('products').where('id', crawlId).update({
                                added_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                                added_id: id[0]
                            }).then(function (response) {
                                console.log(response);
                                add();
                            })
                        }
                    });
                });

                
            })
        });
}
add();
