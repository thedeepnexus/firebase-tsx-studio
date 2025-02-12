import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ContinueWithGoogleButton from "@/components/continue-with-google-button";
import Link from "next/link";

export default function Login() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardContent>
            <ContinueWithGoogleButton />
          </CardContent>
        </CardHeader>
        <CardFooter>
          Don&apos;t have an account?
          <Link href="/register" className="underline pl-2">
            Register here.
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
