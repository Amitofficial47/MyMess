// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { ThemeProvider } from "@/contexts/theme-provider";
// import { DataProvider } from "@/contexts/data-provider";
// import { AuthProvider } from "@/contexts/auth-provider";
// import { Toaster } from "@/components/ui/toaster";
// import { cn } from "@/lib/utils";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// export const metadata: Metadata = {
//   title: "MessMate",
//   description: "Hostel Mess Management System",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={cn("antialiased font-sans", inter.variable)}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <AuthProvider>
//             <DataProvider>
//               {children}
//               <Toaster />
//             </DataProvider>
//           </AuthProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-provider";
import { DataProvider } from "@/contexts/data-provider";
import { AuthProvider } from "@/contexts/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
	title: "MyMess - Smart Mess Management",
	description: "Hostel Mess Management System",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn("antialiased font-sans", inter.variable)}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<AuthProvider>
						<DataProvider>
							{children}
							<Toaster />
						</DataProvider>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
