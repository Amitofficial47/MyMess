// import Link from 'next/link';
// import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

// export function Footer() {
//   return (
//     <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
//       <p className="text-xs text-muted-foreground">&copy; 2024 MessMate. All rights reserved.</p>
//       <nav className="sm:ml-auto flex items-center gap-4 sm:gap-6">
//         <Link href="/terms" className="text-xs text-muted-foreground hover:underline underline-offset-4">
//           Terms
//         </Link>
//         <Link href="/privacy" className="text-xs text-muted-foreground hover:underline underline-offset-4">
//           Privacy
//         </Link>
//         <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
//           <Twitter className="h-5 w-5" />
//           <span className="sr-only">X</span>
//         </Link>
//         <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
//           <Linkedin className="h-5 w-5" />
//           <span className="sr-only">LinkedIn</span>
//         </Link>
//         <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
//           <Facebook className="h-5 w-5" />
//           <span className="sr-only">Facebook</span>
//         </Link>
//         <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
//           <Instagram className="h-5 w-5" />
//           <span className="sr-only">Instagram</span>
//         </Link>
//       </nav>
//     </footer>
//   );
// }

import Link from "next/link";
import { Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

export function Footer() {
	return (
		<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
			<p className="text-xs text-muted-foreground">
				&copy; 2024 MyMess. All rights reserved.
			</p>
			<nav className="sm:ml-auto flex items-center gap-4 sm:gap-6">
				<Link
					href="/terms"
					className="text-xs text-muted-foreground hover:underline underline-offset-4"
				>
					Terms
				</Link>
				<Link
					href="/privacy"
					className="text-xs text-muted-foreground hover:underline underline-offset-4"
				>
					Privacy
				</Link>
				<Link
					href="#"
					className="text-muted-foreground hover:text-primary transition-colors"
				>
					<Twitter className="h-5 w-5" />
					<span className="sr-only">X</span>
				</Link>
				<Link
					href="#"
					className="text-muted-foreground hover:text-primary transition-colors"
				>
					<Linkedin className="h-5 w-5" />
					<span className="sr-only">LinkedIn</span>
				</Link>
				<Link
					href="#"
					className="text-muted-foreground hover:text-primary transition-colors"
				>
					<Facebook className="h-5 w-5" />
					<span className="sr-only">Facebook</span>
				</Link>
				<Link
					href="#"
					className="text-muted-foreground hover:text-primary transition-colors"
				>
					<Instagram className="h-5 w-5" />
					<span className="sr-only">Instagram</span>
				</Link>
			</nav>
		</footer>
	);
}
