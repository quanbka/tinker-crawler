const knex = require('./knex.js');
const cheerio = require('cheerio');

function fetch () {
    knex('products')
        .whereNull('product')
        .first()
        .then(function (result) {
            var product = JSON.stringify(parse(result.html));
            knex('products')
                .where('id', '=', result.id)
                .update({
                    product: product,
                    parsed_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
                })
                .then(function () {
                    console.log(`Done ${result.id}`);
                    fetch();
                })
        });
}

function parse(html) {
    var $ = cheerio.load(html);
    var jsonLdText = $("script[type='application/ld+json']").html()
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/ +/g, ' ')
        .replace(' 15.6"', ' 15.6 Inch')
        .replace(' 27"', ' 15.6 Inch')
        .replace(' 14"', ' 14 Inch')
        .replace(' 23.8"', ' 23.8 Inch')
        .replace(' G1/4"', ' G1/4')
        .replace(/	/g, ' ');
    var jsonLd = JSON.parse(jsonLdText);

    var retval = {
        product: {
            code: jsonLd.sku,
            title: jsonLd.name,
            image_url: jsonLd.image,
            description: jsonLd.description,
            long_description: $('.product-summary-item-ul').html(),
            price: $('#product-info-price .giany').text() 
                ? $('#product-info-price .giany').text().replace(/\s+/g, '').replace('₫', '').replace(/\./g, '') 
                : jsonLd.offers.price,
            sale_price: jsonLd.offers.price,
            name: jsonLd.name,
            sku: jsonLd.sku,
            manufacturer: jsonLd.brand.name,
            content: $('#tab1 div').first().html().replace(/hanoicomputercdn.com/g, 'tinker.vn'),
            search: '',
            slug: jsonLd.offers.url.replace('https://www.hanoicomputer.vn/', ''),
            status: 'pending',
            warranty: $('.ribbons div').last().text()
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
