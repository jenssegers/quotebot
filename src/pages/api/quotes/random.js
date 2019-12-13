import repository from '../../../domain/quotes/repository';

export default async (req, res) => {
  const parsed = /^<@([\w]+)\|[\w]+>.*/gi.exec(req.body.text);
  let quote;

  if (parsed) {
    const [full, authorId] = parsed;
    quote = await repository.random(authorId);
  } else {
    quote = await repository.random();
  }

  res.status(200).json({
    'response_type': 'in_channel',
    'attachments': [
      {
        'fallback':
          `> ${quote.quote} \n` +
          `> * ${quote.author} * \n` +
          'https://quotebot.jenssegers.com',
        'author_name': quote.author,
        'thumb_url': quote.avatar,
        'text': quote.quote,
        'actions': [
          {
            'type': 'button',
            'text': 'View all quotes',
            'url': 'https://quotebot.jenssegers.com',
          },
        ],
      },
    ],
  });
};
