import { PrismaClient } from "@prisma/client";
import { WebClient } from "@slack/web-api";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";

type ResponseType =
  | {
      response_type: string;
      attachments: [
        {
          fallback: string;
          author_name: string;
          thumb_url: string;
          text: string;
          actions: [
            {
              type: string;
              text: string;
              url: string;
            }
          ];
        }
      ];
    }
  | { text: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const parsed = /^<@([\w]+)\|.+?>\s*(.+)/gi.exec(req.body.text);

  if (!parsed) {
    res.status(200).json({
      text: "Usage: /quote *@username* quote",
    });
    return;
  }

  const [_full, userId, text] = parsed;
  const slack = new WebClient(process.env.SLACK_TOKEN);
  const profile = await slack.users.info({ user: userId });
  const prisma = new PrismaClient();

  const author = await prisma.author.upsert({
    where: {
      id: userId,
    },
    update: {
      name: profile.user?.real_name,
      avatar: profile.user?.profile?.image_192,
    },
    create: {
      id: userId,
      name: profile.user?.real_name as string,
      avatar: (profile.user?.profile?.image_512 ||
        profile.user?.profile?.image_original) as string,
    },
  });

  const quote = await prisma.quote.create({
    data: {
      id: uuid(),
      channel: req.body.channel_name,
      author_id: author.id,
      quote: text,
    },
  });

  res.status(200).json({
    response_type: "in_channel",
    attachments: [
      {
        fallback:
          `> ${quote.quote} \n` +
          `> * ${author.name} * \n` +
          `https://${req.headers.host}`,
        author_name: author.name,
        thumb_url: author.avatar,
        text: quote.quote,
        actions: [
          {
            type: "button",
            text: "View all quotes",
            url: `https://${req.headers.host}`,
          },
        ],
      },
    ],
  });
}
