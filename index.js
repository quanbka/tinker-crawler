const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host : '192.168.1.172',
    port : 3306,
    user : 'root',
    password : '123@123',
    database : 'tinker_crawl'
  },
  pool: { min: 0, max: 7 }
});



const { readFile } = require('fs');


const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser/src/fxp");

readFile('sitemap_product.xml', { encoding : 'utf8'},  (err, data) => {
  if (err) throw err;
  const parser = new XMLParser();
  let sitemapObj = parser.parse(data);
  // console.log(sitemapObj.urlset.url.length)


  sitemapObj.urlset.url.forEach((item, i) => {
      knex('products').insert({url: item.loc}).then()

  });


});
