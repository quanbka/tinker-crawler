const knex = require('./knex.js');
// const knex2 = require('./knex2.js');
const cheerio = require('cheerio');
const htmlMetadata = require('html-metadata');

function fetch () {
    knex('products')
        .whereNull('product')
        // .where('id', 46)
        .first()
        .then(function (result) {
            console.log(result.url);
            let product = JSON.stringify(parse(result.html));
            knex('products')
                .where('id', '=', result.id)
                .update({product})
                .then(function () {
                    console.log(`Done ${result.id}`);
                    fetch();
                })
        });
}

function parse(html) {
    var $ = cheerio.load(html);
    text = $("script[type='application/ld+json']")[0].children[0].data
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/ +/g, " ")
        .replace(' 15.6"', ' 15.6 Inch')
        .replace(' 27"', ' 15.6 Inch')
        .replace(' 14"', ' 14 Inch')
        .replace(/	/g, ' ');
    console.log(text);
    jsonLd = JSON.parse(text);
    // console.log(json);
    // var jsonLd = JSON.parse($("script[type='application/ld+json']").html().replace(/\r?\n|\r/g, ''));
    var retval = {
        product: {
            code: jsonLd.sku,
            title: jsonLd.name,
            image_url: jsonLd.image,
            description: jsonLd.description,
            long_description: $('.product-summary-item-ul').html(),
            price: $('#product-info-price .giany').text().replace(/\s+/g, '').replace('₫', '').replace(/\./g, ''),
            sale_price: jsonLd.offers.price,
            name: jsonLd.name,
            sku: jsonLd.sku,
            manufacturer: jsonLd.brand.name,
            content: $('#tab1 div').first().html().replace(/hanoicomputercdn.com/g, 'tinker.vn'),
            search: '',
            create_time: '',
            slug: jsonLd.offers.url.replace('https://www.hanoicomputer.vn/', ''),
            status: 'pending'
        },
        gallery: [],
        brand: {
            title: jsonLd.brand.name,
            slug: jsonLd.brand.name.toLowerCase().replace(/\s+/g, '-'),
        }
    };
    var gallery = $('#img_thumb .img_thumb');
    gallery.each(function () {
        retval.gallery.push({
            image_url: $(this).attr('data-href')
        });
    });

    return retval;
}

fetch();
