const knex = require('./knex.js');

const { readFile } = require('fs');


const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser/src/fxp");

readFile('sitemap_product.xml', { encoding : 'utf8'},  (err, data) => {
  if (err) throw err;
  const parser = new XMLParser();
  let sitemapObj = parser.parse(data);
  // console.log(sitemapObj.urlset.url.length)


  sitemapObj.urlset.url.forEach((item, i) => {
      console.log(i);
      knex('products').insert({url: item.loc}).onConflict().ignore().then()

  });


});
