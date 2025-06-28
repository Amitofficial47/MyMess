// import Link from "next/link";
// import { Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

// export function Footer() {
// 	return (
// 		<footer className="bg-muted text-muted-foreground">
// 			<div className="container py-12">
// 				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
// 					{/* Column 1: Logo and Socials */}
// 					<div className="flex flex-col gap-4 items-center">
// 						<Link
// 							href="/"
// 							className="flex items-center gap-2 font-semibold justify-center"
// 						>
// 							<svg
// 								xmlns="http://www.w3.org/2000/svg"
// 								viewBox="0 0 24 24"
// 								fill="none"
// 								stroke="currentColor"
// 								strokeWidth="2"
// 								strokeLinecap="round"
// 								strokeLinejoin="round"
// 								className="h-8 w-8 text-primary"
// 							>
// 								<path d="M12 22a10 10 0 0 0 10-10H2a10 10 0 0 0 10 10Z" />
// 								<path d="M7 12a5 5 0 0 1 10 0" />
// 								<path d="M12 2v2" />
// 								<path d="m4.93 4.93 1.41 1.41" />
// 								<path d="m17.66 6.34 1.41-1.41" />
// 							</svg>
// 							<span className="text-xl text-foreground">MyMess</span>
// 						</Link>
// 						<p className="text-sm">
// 							Simplifying hostel dining with modern technology.
// 						</p>
// 						<div className="flex gap-4 mt-2 justify-center">
// 							<Link
// 								href="#"
// 								className="text-muted-foreground hover:text-primary transition-colors"
// 							>
// 								<Twitter className="h-5 w-5" />
// 								<span className="sr-only">X</span>
// 							</Link>
// 							<Link
// 								href="#"
// 								className="text-muted-foreground hover:text-primary transition-colors"
// 							>
// 								<Linkedin className="h-5 w-5" />
// 								<span className="sr-only">LinkedIn</span>
// 							</Link>
// 							<Link
// 								href="#"
// 								className="text-muted-foreground hover:text-primary transition-colors"
// 							>
// 								<Facebook className="h-5 w-5" />
// 								<span className="sr-only">Facebook</span>
// 							</Link>
// 							<Link
// 								href="#"
// 								className="text-muted-foreground hover:text-primary transition-colors"
// 							>
// 								<Instagram className="h-5 w-5" />
// 								<span className="sr-only">Instagram</span>
// 							</Link>
// 						</div>
// 					</div>

// 					{/* Column 2: Product */}
// 					<div className="flex flex-col gap-2">
// 						<h3 className="font-semibold text-foreground">Product</h3>
// 						<Link
// 							href="/#features"
// 							className="hover:text-primary transition-colors"
// 						>
// 							Features
// 						</Link>
// 						<Link
// 							href="/#how-it-works"
// 							className="hover:text-primary transition-colors"
// 						>
// 							How it Works
// 						</Link>
// 						<Link
// 							href="/login"
// 							className="hover:text-primary transition-colors"
// 						>
// 							Login
// 						</Link>
// 						<Link
// 							href="/signup"
// 							className="hover:text-primary transition-colors"
// 						>
// 							Sign Up
// 						</Link>
// 					</div>

// 					{/* Column 3: Company */}
// 					<div className="flex flex-col gap-2">
// 						<h3 className="font-semibold text-foreground">Company</h3>
// 						<Link href="#" className="hover:text-primary transition-colors">
// 							About Us
// 						</Link>
// 						<Link href="#" className="hover:text-primary transition-colors">
// 							Contact
// 						</Link>
// 						<Link href="#" className="hover:text-primary transition-colors">
// 							Careers
// 						</Link>
// 					</div>

// 					{/* Column 4: Legal */}
// 					<div className="flex flex-col gap-2">
// 						<h3 className="font-semibold text-foreground">Legal</h3>
// 						<Link
// 							href="/terms"
// 							className="hover:text-primary transition-colors"
// 						>
// 							Terms of Service
// 						</Link>
// 						<Link
// 							href="/privacy"
// 							className="hover:text-primary transition-colors"
// 						>
// 							Privacy Policy
// 						</Link>
// 					</div>
// 				</div>
// 			</div>
// 			<div className="border-t">
// 				<div className="container py-4 text-center text-sm">
// 					&copy; {new Date().getFullYear()} MyMess. All rights reserved.
// 				</div>
// 			</div>
// 		</footer>
// 	);
// }

import Link from "next/link";
import { Heart, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

export function Footer() {
	return (
		<footer className="bg-muted text-muted-foreground">
			<div className="container py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
					{/* Column 1: Logo and Socials */}
					<div className="flex flex-col gap-4 items-center">
						<Link
							href="/"
							className="flex items-center gap-2 font-semibold justify-center"
						>
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
							<span className="text-xl text-foreground">MyMess</span>
						</Link>
						<p className="text-sm">
							Simplifying hostel dining with modern technology.
						</p>
						<div className="flex gap-4 mt-2 justify-center">
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
						</div>
					</div>

					{/* Column 2: Product */}
					<div className="flex flex-col gap-2">
						<h3 className="font-semibold text-foreground">Product</h3>
						<Link
							href="/#features"
							className="hover:text-primary transition-colors"
						>
							Features
						</Link>
						<Link
							href="/#how-it-works"
							className="hover:text-primary transition-colors"
						>
							How it Works
						</Link>
						<Link
							href="/login"
							className="hover:text-primary transition-colors"
						>
							Login
						</Link>
						<Link
							href="/signup"
							className="hover:text-primary transition-colors"
						>
							Sign Up
						</Link>
					</div>

					{/* Column 3: Company */}
					<div className="flex flex-col gap-2">
						<h3 className="font-semibold text-foreground">Company</h3>
						<Link
							href="/about"
							className="hover:text-primary transition-colors"
						>
							About Us
						</Link>
						<Link
							href="/contact"
							className="hover:text-primary transition-colors"
						>
							Contact
						</Link>
						<Link
							href="/careers"
							className="hover:text-primary transition-colors"
						>
							Careers
						</Link>
					</div>

					{/* Column 4: Legal */}
					<div className="flex flex-col gap-2">
						<h3 className="font-semibold text-foreground">Legal</h3>
						<Link
							href="/terms"
							className="hover:text-primary transition-colors"
						>
							Terms of Service
						</Link>
						<Link
							href="/privacy"
							className="hover:text-primary transition-colors"
						>
							Privacy Policy
						</Link>
					</div>
				</div>
			</div>
			<div className="border-t">
				<div className="container py-4 text-center text-sm">
					<p>&copy; {new Date().getFullYear()} MyMess. All rights reserved.</p>
					<p className="mt-2">
						Made with{" "}
						<Heart className="inline-block h-4 w-4 fill-pink-500 text-pink-500" />{" "}
						by Amit Malhotra
					</p>
				</div>
			</div>
		</footer>
	);
}
