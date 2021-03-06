import Mysql from '../../infrastructure/Mysql';

class QuotesRepository {
  async findAll() {
    const connection = await Mysql.getConnection();

    const [rows, fields] = await connection.query(
      'SELECT quotes.id, quotes.quote, COALESCE(authors.name, quotes.author) as author, COALESCE(authors.avatar, quotes.avatar) as avatar ' +
        'FROM quotes ' +
        'LEFT JOIN authors ON authors.id = quotes.author_id ' +
        'ORDER BY added_at DESC',
    );

    return rows;
  }

  async random(authorId) {
    const connection = await Mysql.getConnection();
    let results;

    if (authorId) {
      [
        results,
      ] = await connection.query(
        'SELECT quotes.id, quotes.quote, COALESCE(authors.name, quotes.author) as author, COALESCE(authors.avatar, quotes.avatar) as avatar ' +
          'FROM quotes ' +
          'LEFT JOIN authors ON authors.id = quotes.author_id ' +
          'WHERE quotes.author_id = ? ' +
          'ORDER BY RAND() LIMIT 1',
        [authorId],
      );
    } else {
      [results] = await connection.query(
        'SELECT quotes.id, quotes.quote, COALESCE(authors.name, quotes.author) as author, COALESCE(authors.avatar, quotes.avatar) as avatar ' +
          'FROM quotes ' +
          'LEFT JOIN authors ON authors.id = quotes.author_id ' +
          'ORDER BY RAND() LIMIT 1',
      );
    }

    return results[0];
  }

  async search(text) {
    const connection = await Mysql.getConnection();

    const [
      results,
    ] = await connection.query(
      'SELECT quotes.id, quotes.quote, COALESCE(authors.name, quotes.author) as author, COALESCE(authors.avatar, quotes.avatar) as avatar ' +
        'FROM quotes ' +
        'LEFT JOIN authors ON authors.id = quotes.author_id ' +
        'WHERE quotes.quote LIKE ? ' +
        'ORDER BY RAND() LIMIT 1',
      [`%${text}%`],
    );

    return results ? results[0] : null;
  }

  async add(quote) {
    const connection = await Mysql.getConnection();

    await connection.execute(
      'INSERT INTO quotes ' +
        'SET id = ?, channel = ?, author_id = ?, quote = ?',
      [quote.id, quote.channel, quote.authorId, quote.quote],
    );

    await connection.execute(
      'INSERT INTO authors ' +
        'SET id = ?, name = ?, avatar = ? ' +
        'ON DUPLICATE KEY ' +
        'UPDATE name = ?, avatar = ?',
      [quote.authorId, quote.author, quote.avatar, quote.author, quote.avatar],
    );
  }
}

export default new QuotesRepository();
