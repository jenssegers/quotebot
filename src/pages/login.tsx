import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google", undefined, {
        hd: process.env.NEXT_PUBLIC_GOOGLE_DOMAIN as string,
      });
    } else {
      router.push("/");
    }
  }, [router, status]);
}
