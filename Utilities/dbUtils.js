import dbUpgrade from '../assets/db/db-upgrades.json';

export async function initDatabase(db) {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS score (id INTEGER PRIMARY KEY AUTOINCREMENT, game_type TEXT, score INT, date_played date)'
    )
  })
}

export const upgradeDbVersion = async (db) => {
  await runTransaction(db, 'create table if not exists version (version integer);');

  const queryResults = await runTransaction(db, 'select version from version;');

  let currentVersion = 1
  if (queryResults.length !== 0) {
    currentVersion = queryResults[0].version
  } else {
    await runTransaction(db, 'update version set version = 1;');
  }
  if (currentVersion < dbUpgrade.version) {
    upgradeFrom(db, currentVersion)
  }
}

const upgradeFrom = async (db, previousVersion) => {
  let statements = [];
  let version = dbUpgrade.version - (dbUpgrade.version - previousVersion) + 1;
  let length = Object.keys(dbUpgrade.upgrades).length;

  for (let i = 0; i < length; i += 1) {
    let upgrade = dbUpgrade.upgrades[`to_v${version}`];

    if (upgrade) {
      statements = [...statements, ...upgrade];
    } else {
      break;
    }

    version++;
  }

  statements = [...statements, `REPLACE into version (version) VALUES (${dbUpgrade.version})`];

  for (let i = 0; i < statements.length; i += 1) {
    await runTransaction(db, statements[i]);
  }
}

export const runTransaction = (db, sql) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        undefined,
        (_, { rows: { _array } }) => resolve(_array),
        (txObj, error) => {
          console.log('Error ', error, sql)
          resolve(undefined)
        }
      );
    })
  })
}
