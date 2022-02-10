const knex = require('./knex.js');

const { readFile } = require('fs');


const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser/src/fxp");
//
// readFile('sitemap_product.xml', { encoding : 'utf8'},  (err, data) => {
//   if (err) throw err;
//   const parser = new XMLParser();
//   let sitemapObj = parser.parse(data);
//   // console.log(sitemapObj.urlset.url.length)
//   sitemapObj.urlset.url.forEach((item, i) => {
//       console.log(i);
//       knex('products').insert({url: item.loc}).onConflict().ignore().then()
//
//   });
// });
//
//
// readFile('laptop88.xml', { encoding : 'utf8'},  (err, data) => {
//   if (err) throw err;
//   const parser = new XMLParser();
//   let sitemapObj = parser.parse(data);
//   // console.log(sitemapObj.urlset.url.length)
//   sitemapObj.urlset.url.forEach((item, i) => {
//       console.log(i);
//       knex('products').insert({url: item.loc, site: 2}).onConflict().ignore().then()
//   });
// });

//
// readFile('laptoptcc.html', { encoding : 'utf8'},  (err, data) => {
//     let array = [];
//     const regex = /"(https:\/\/laptoptcc.com\/cua-hang\/(.*?))"/g;
//     const found = data.match(regex);
//
//
//
//
//     array = [...new Set(found)];
//     for (var i = 0; i < array.length; i++) {
//         array[i] = array[i].replace('"', '');
//     }
//
//     array.forEach((item, i) => {
//         console.log(i);
//         knex('products').insert({url: item, site: 3}).onConflict().ignore().then()
//     });
//
//     // console.log(array);
// });
