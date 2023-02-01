import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type ResponseType = {
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
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const prisma = new PrismaClient();
  const quotes = await prisma.quote.findMany({
    where: {
      quote: {
        contains: req.body.text,
      },
    },
    include: {
      author: true,
    },
  });

  if (!quotes) {
    return res.status(404);
  }

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  res.status(200).json({
    response_type: "in_channel",
    attachments: [
      {
        fallback:
          `> ${quote.quote} \n` +
          `> * ${quote.author.name} * \n` +
          `https://${req.headers.host}`,
        author_name: quote.author.name,
        thumb_url: quote.author.avatar,
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
