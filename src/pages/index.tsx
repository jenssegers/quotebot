import { Author, PrismaClient, Quote } from "@prisma/client";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { getServerSession } from "next-auth";
import Emoji from "node-emoji";
import MarkdownIt from "markdown-it";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const quotes = await prisma.quote.findMany({
    orderBy: {
      added_at: "desc",
    },
    include: {
      author: true,
    },
  });

  return {
    props: {
      quotes: quotes.map((quote) => ({
        ...quote,
        quote: quote.quote.replace(
          /<@[\w]+\|(.+?)>/gi,
          (_match, user) => `**@${user}**`
        ),
        added_at: quote.added_at.toISOString(),
      })),
    },
  };
};

export default function Home({
  quotes,
}: {
  quotes: (Partial<Quote> & { author: Author })[];
}) {
  return (
    <main className="bg-gray-100 min-h-screen w-screen p-6">
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
      >
        {quotes.map((quote) => (
          <li
            key={quote.id}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
          >
            <div className="flex w-full h-full items-center justify-between space-x-3 p-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3
                    className="text-base font-medium text-gray-900"
                    dangerouslySetInnerHTML={{
                      __html: Emoji.emojify(
                        new MarkdownIt().render(quote.quote as string)
                      ),
                    }}
                  ></h3>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {quote.author.name}
                </p>
              </div>
              <Image
                className="h-16 w-16 flex-shrink-0 rounded-full bg-gray-300"
                width={512}
                height={512}
                src={quote.author.avatar}
                alt={quote.author.name}
              />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
