import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";

import { prisma } from "@/lib/prisma";
import slack from "@/lib/slack";

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
  const profile = (await slack.users.profile.get({ user: userId })).profile;

  if (!profile) {
    res.status(500);
    return;
  }

  await prisma.author.upsert({
    where: {
      id: userId,
    },
    update: {
      name: profile.real_name,
      avatar: profile.image_512 || profile.image_original,
    },
    create: {
      id: userId,
      name: profile.real_name as string,
      avatar: (profile.image_512 || profile.image_original) as string,
    },
  });

  const quote = await prisma.quote.create({
    data: {
      id: uuid(),
      channel: req.body.channel_name,
      author_id: userId,
      quote: text,
    },
  });

  res.status(200).json({
    response_type: "in_channel",
    attachments: [
      {
        fallback:
          `> ${quote.quote} \n` +
          `> * ${profile.real_name} * \n` +
          `https://${req.headers.host}`,
        author_name: profile.real_name as string,
        thumb_url: (profile.image_512 || profile.image_original) as string,
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
