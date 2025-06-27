// import React from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Home } from "lucide-react";
// import { ThemeToggle } from "@/components/layout/theme-toggle";

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex flex-col min-h-screen bg-background">
//       <header className="px-4 lg:px-6 h-16 flex items-center border-b shrink-0">
//         <Link href="/" className="flex items-center gap-2 font-semibold">
//             <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="h-8 w-8 text-primary"
//             >
//                 <path d="M12 22a10 10 0 0 0 10-10H2a10 10 0 0 0 10 10Z" />
//                 <path d="M7 12a5 5 0 0 1 10 0" />
//                 <path d="M12 2v2" />
//                 <path d="m4.93 4.93 1.41 1.41" />
//                 <path d="m17.66 6.34 1.41-1.41" />
//             </svg>
//             <span className="text-xl text-primary">MessMate</span>
//         </Link>
//         <nav className="ml-auto flex items-center gap-2">
//           <Link href="/">
//             <Button variant="outline">
//               <Home className="mr-2 h-4 w-4" />
//               Home
//             </Button>
//           </Link>
//           <ThemeToggle />
//         </nav>
//       </header>
//       <main className="flex-1 flex items-center justify-center p-4">
//         <div className="w-full max-w-md">
//             {children}
//         </div>
//       </main>
//     </div>
//   );
// }

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen bg-background">
			<header className="px-4 lg:px-6 h-16 flex items-center border-b shrink-0">
				<Link href="/" className="flex items-center gap-2 font-semibold">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-8 w-8 text-primary"
					>
						<path d="M12 22a10 10 0 0 0 10-10H2a10 10 0 0 0 10 10Z" />
						<path d="M7 12a5 5 0 0 1 10 0" />
						<path d="M12 2v2" />
						<path d="m4.93 4.93 1.41 1.41" />
						<path d="m17.66 6.34 1.41-1.41" />
					</svg>
					<span className="text-xl text-primary">MyMess</span>
				</Link>
				<nav className="ml-auto flex items-center gap-2">
					<Link href="/">
						<Button variant="outline">
							<Home className="mr-2 h-4 w-4" />
							Home
						</Button>
					</Link>
					<ThemeToggle />
				</nav>
			</header>
			<main className="flex-1 flex items-center justify-center p-4">
				<div className="w-full max-w-md">{children}</div>
			</main>
		</div>
	);
}
