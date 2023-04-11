

export async function initDatabase(db) {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS score (id INTEGER PRIMARY KEY AUTOINCREMENT, game_type TEXT, score INT, date_played date)'
    )
  })
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
