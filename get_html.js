const knex = require('./knex.js');
const axios = require('axios').default;



function fetch () {
    knex('products').whereNull('html').first().then(function (result) {
        console.log(result);

        axios.get(result.url)
          .then(function (response) {
            // handle success
            // console.log(response.data);
            let data =   response.data ;
            // let data =   '';
            knex('products').where('id', '=',  result.id).update({html: data}).then(function () {
                // console.log(`Done ${id}`);
                fetch();
            })

          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .then(function () {
            // always executed
          });
    });
}


fetch();
