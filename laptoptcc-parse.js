const knex = require('./knex.js');
const cheerio = require('cheerio');

function fetch () {
    knex('products')
        .whereNull('parsed_at')
        .where('site', 3)
        .first()
        .then(function (result) {
            var product = JSON.stringify(parse(result.html));
            knex('products')
                .where('id', '=', result.id)
                .where('site', 3)
                .update({
                    product: product,
                    parsed_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
                })
                .then(function () {
                    console.log(`Done LaptopTCC ${result.id}`);
                    fetch();
                })
        });
}

function parse(html) {
    var $ = cheerio.load(html);

    var retval = {
        product: {
            code: '',
            title: $('.product_title').text(),
            image_url: $('meta[property="og:image"]').attr('content'),
            description: '',
            long_description: $('.specifications').html(),
            price: $('span[class="price"] bdi').first().text().replace(/\./g, '').replace('đ', ''),
            sale_price: $('span[class="price"] bdi').first().text().replace(/\./g, '').replace('đ', ''),
            name: $('.product_title').text(),
            content: $('.electro-description').html() 
                ? $('.electro-description').html()
                    .replace(/LaptopTCC/g, 'Tinker.vn')
                    .replace(/Laptop TCC/g, 'Tinker.vn')
                    // .replace(/laptoptcc.com/g, 'tinker.vn')
                    .replace(/LAPTOP TCC/g, 'tinker.vn')
                : '',
            search: '',
            slug: $('meta[property="og:url"]').attr('content').replace('https://laptoptcc.com/cua-hang/', '').replace('/', ''),
            status: 'pending',
        },
        gallery: [],
        brand: {},
        attributes: {}
    };

    var gallery = $('.thumb');
    gallery.each(function () {
        retval.gallery.push({
            image_url: $(this).attr('data-hq').includes('https://') ? 'https:' + $(this).attr('data-hq') : $(this).attr('data-hq')
        });
    });

    var attributes = $('.specifications:first').find($('li'));
    var attributeKey = null;
    var attributeValue = null;
    var attributeParts = null;
    if (attributes.length) {
        attributes.each(function (index) {
            attributeKey = null;
            attributeValue = null;
            attributeParts = $(this).text().split(':');
            attributeKey = attributeParts[0];
            attributeValue = attributeParts[1];
            if (attributeKey && attributeValue) {
                retval.attributes[attributeKey] = attributeValue;
            }
        });
    }

    return retval;
}

fetch();
