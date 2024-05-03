/**
 * Implementation for CatalogService defined in ./cat-service.cds
 */

const cds = require('@sap/cds')

module.exports = cds.service.impl((srv) => {

  srv.on('test', async (req) => {
    return "Hello word";
  })

})