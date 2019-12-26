import uuid from 'uuid/v4';
import { WebClient } from '@slack/web-api';
import QuotesRepository from '../../../domain/quotes/QuotesRepository';
import morgan from 'micro-morgan';
import { IncomingMessage, ServerResponse } from 'http';
import { Quote } from '../../../domain/quotes/Quote';

export default morgan('common')(async (req: IncomingMessage, res: ServerResponse) => {
  console.log(req);

  const parsed = /^<@([\w]+)\|.+>\s*(.+)/gi.exec(req.body.text);

  if (!parsed) {
    res.status(200).json({
      text: 'Usage: /quote *@username* quote',
    });

    return;
  }

  const [full, authorId, text] = parsed;
  const slack = new WebClient(process.env.SLACK_TOKEN);
  const profile = await slack.users.info({ user: authorId });

  const quote = new Quote(
    uuid(),
    text,
    profile.user.profile.real_name,
    authorId,
    profile.user.profile.image_512 || profile.user.profile.image_original,
    req.body.channel_name
  );

  await QuotesRepository.add(quote);

  res.status(200).json({
    response_type: 'in_channel',
    attachments: [
      {
        fallback:
          `> ${quote.quote} \n` +
          `> * ${quote.author} * \n` +
          `https://${req.headers.host}`,
        author_name: quote.author,
        thumb_url: quote.avatar,
        text: quote.quote,
        actions: [
          {
            type: 'button',
            text: 'View all quotes',
            url: `https://${req.headers.host}`,
          },
        ],
      },
    ],
  });
});
