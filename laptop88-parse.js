const knex = require('./knex.js');
const cheerio = require('cheerio');

function fetch () {
    knex('products')
        .whereNull('parsed_at')
        .where('site', 2)
        .first()
        .then(function (result) {
            var product = JSON.stringify(parse(result.html));
            knex('products')
                .where('id', '=', result.id)
                .where('site', 2)
                .update({
                    product: product,
                    parsed_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
                })
                .then(function () {
                    console.log(`Done Laptop88 ${result.id}`);
                    fetch();
                })
        });
}

function parse(html) {
    var $ = cheerio.load(html);
    
    var retval = {
        product: {
            code: 'T-' + $('.buy-now').attr('data-id'),
            title: $('.detail-top h1').first().text(),
            image_url: $('meta[property="og:image"]').attr('content'),
            description: $('meta[property="og:description"]').attr('content'),
            long_description: $('.prodetail-spec-full ul').length ? $('.prodetail-spec-full ul')[0].outerHTML : '',
            price: $('.unprice span').length
                ? $('.unprice span').text().replace(/\./g,'').replace(/\Đ/g,'')
                : $('.js-price-config').first().text().replace(/\./g,'').replace(/\Đ/g,''),
            sale_price: $('.js-price-config').first().text().replace(/\./g,'').replace(/\Đ/g,''),
            name: $('.detail-top h1').first().text(),
            content: $('.emtry-content').first().html(),
            search: '',
            slug: $('meta[property="og:url"]').attr('content').replace('https://laptop88.vn/', '').replace('.html', ''),
            status: 'pending',
            warranty: $('.pro-warranty p').length 
                ? $('.pro-warranty p').first().html().replace(/<a href=(.*?)<\/a>/, '').replace('✅', '').replace('Laptop88', '')
                : $('.pro-warranty').text().replace(/<a href=(.*?)<\/a>/, '').replace('✅', '').replace('Laptop88', '')
        },
        gallery: [],
        brand: {},
        attributes: {}
    };

    var gallery = $('#sync1 a');
    gallery.each(function () {
        retval.gallery.push({
            image_url: 'https://laptop88.vn' + $(this).attr('href')
        });
    });

    var attributes = $('.prodetail-spec-full:first').find($('tr'));
    if (attributes.length) {
        attributes.each(function (index) {
            retval.attributes[$(this).find($('td')).first().text()] = $(this).find($('td')).last().text();
        });
    }

    return retval;
}

fetch();
