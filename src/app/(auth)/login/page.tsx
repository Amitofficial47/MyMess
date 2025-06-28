// import { LoginForm } from "@/components/auth/login-form";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Link from "next/link";

// export default function LoginPage() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-2xl text-center">Welcome Back!</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <LoginForm />
//         <p className="mt-4 text-center text-sm text-muted-foreground">
//           Don&apos;t have an account?{" "}
//           <Link href="/signup" className="font-medium text-primary hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </CardContent>
//     </Card>
//   );
// }

import { LoginForm } from "@/components/auth/login-form";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Welcome Back!</CardTitle>
				<CardDescription>
					Enter your credentials to access your account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<LoginForm />
				<p className="mt-4 text-center text-sm text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link
						href="/signup"
						className="font-medium text-primary hover:underline"
					>
						Sign up
					</Link>
				</p>
			</CardContent>
		</Card>
	);
}
