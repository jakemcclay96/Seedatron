const { createConnection, closeConnection, query } = require('./db');

const runApplication = async () => {
  await createConnection();
}

const userSeedEntity = {
  name: 'users',
  fields: [
    { name: 'id', type: 'number', pk: true },
    { name: 'firstName', type: 'string' },
  ],
};

const seedData = [
  { name: 'jake' },
  { name: 'layla' },
]


const insert = async (entity, values) => {
  const insertFields = entity.fields.filter(field => field.pk !== true).map(field => field.name);
  const entityFields = entity.fields.map(field => field.name);
  
  let valueCounter = 0;
  const sqlValues = values.map((valObj) => {
    let valsRawSql = '(';
    valsRawSql += Object.values(valObj).map((_) => {
      valueCounter += 1;
      return `$${valueCounter}`
    }).join(', ');
    valsRawSql += ')';
    return valsRawSql;
  }).join(', ');

  let valuesToInsert = [];
  values.forEach((valObj) => {
    Object.values(valObj).forEach((v) => valuesToInsert.push(v));
  });

  const returningVals = `RETURNING "${entityFields.join('", "')}"`;
  const sql = `INSERT INTO "${entity.name}"("${insertFields.join('", "')}") VALUES${sqlValues} ${returningVals}`;
  console.log({ sql, values: valuesToInsert });

  const { rowCount, rows } = await query(sql, valuesToInsert);
  console.log({ count: rowCount, rows  });
};

/*** MAIN ***/
(async () => {
  try {
    await runApplication();
    await insert(userSeedEntity, seedData);
    await closeConnection();
  } catch (err) {
    console.warn(`ERROR: ${err.message}`);
    console.warn(`STACK: ${err.stack}`);
  }
})();