const knex = require('./knex.js');
const cheerio = require('cheerio');

function fetch () {
    knex('products')
        .whereNull('parsed_at')
        .where('site', 1)
        .first()
        .then(function (result) {
            var product = JSON.stringify(parse(result.html));
            knex('products')
                .where('id', '=', result.id)
                .where('site', 1)
                .update({
                    product: product,
                    parsed_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    added_id: null
                })
                .then(function () {
                    console.log(`Done Hanoicomputer ${result.id}`);
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
        // .replace(' G1/4"', 'G1/4')
        .replace('"video tdr failure amdkmdag.sys"', 'video tdr failure amdkmdag.sys')
        .replace(' 2.36"', ' 2.36 Inch')
        .replace('1/2.7"', '1/2.7')
        .replace(' 2.5"', ' 2.5 Inch')
        .replace(' 24"', ' 24 Inch')
        .replace(' 3.5"', ' 3.5 Inch')
        .replace('", TFT', 'TFT')
        .replace('"6 nút bấm có thể lập trình"', '6 nút bấm có thể lập trình')
        .replace(/	/g, ' ')
        .replace('\\Cong', '/Cong')
        .replace(/"description": "(.*?)",/g, '"description": "",')
        .replace(/"reviewBody": "(.*?)",/, '"reviewBody": "",')
        .replace('khó lắm"', 'khó lắm');
    var jsonLd = JSON.parse(jsonLdText);

    var content = $('#tab1 div').first().html();
    if (content) {
        content = content
            // .replace(/hanoicomputercdn.com/g, 'tinker.vn')
            .replace(/<h2 class="ddnb-title spct-title">(.*?)<\/h2>/, '')
            .replace('"/media/', '"https://hanoicomputercdn.com/media/');
    } else {
        content = '';
    }

    var retval = {
        product: {
            code: jsonLd.sku,
            title: jsonLd.name,
            image_url: jsonLd.image,
            description: $('meta[name="description"]').attr('content').replace(/HACOM/g, 'Tinker.vn'),
            long_description: $('.product-summary-item-ul').length ? $('.product-summary-item-ul')[0].outerHTML : '',
            price: $('#product-info-price .giany').text() 
                ? $('#product-info-price .giany').text().replace(/\s+/g, '').replace('₫', '').replace(/\./g, '') 
                : jsonLd.offers.price,
            sale_price: jsonLd.offers.price,
            name: jsonLd.name,
            manufacturer: jsonLd.brand.name,
            content: content,
            search: '',
            slug: jsonLd.offers.url.replace('https://www.hanoicomputer.vn/', ''),
            status: 'pending',
            warranty: $('.ribbons div').last().text()
        },
        gallery: [],
        brand: {
            title: jsonLd.brand.name,
            slug: jsonLd.brand.name.toLowerCase().replace(/\s+/g, '-'),
        },
        attributes: []
    };

    var gallery = $('#img_thumb .img_thumb');
    gallery.each(function () {
        retval.gallery.push({
            image_url: $(this).attr('data-href')
        });
    });

    var attributes = $('.bang-tskt:first').find($('tr'));
    if (attributes.length) {
        attributes.each(function (index) {
            var attributeKey = $(this).find($('td')).first().text().replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/ +/g, ' ');
            var attributeValue = $(this).find($('td')).last().text().replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/ +/g, ' ');
            retval.attributes.push({
                "attribute": {
                    "name": attributeKey
                },
                "value": {
                    "name": attributeValue
                }
            });
        });
    }

    return retval;
}

fetch();
