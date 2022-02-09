const knex = require('./knex.js');
const axios = require('axios').default;



function fetch () {
    knex('products').whereNull('html').orderByRaw('RAND()').whereNotNull('url').orderBy('id', 'desc').first().then(function (result) {
        console.log(result);

        axios.get(result.url)
          .then(function (response) {
            // handle success
            // console.log(response.data);
            let data =   response.data ;
            // let data =   '';
            knex('products').where('id', '=',  result.id).update({html: data}).then(function () {
                // console.log(`Done ${id}`);

            })

          })
          .catch(function (error) {
              knex('products').where('id', '=',  result.id).delete().then(function () {
                  // console.log(`Done ${id}`);

              })
            console.log(error);
          })
          .then(function () {
            fetch();
          });
    });
}


fetch();
