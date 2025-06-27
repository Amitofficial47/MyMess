export interface Hostel {
	name: string;
	capacity: number;
	type: "Girls" | "Boys";
}

export const hostels: Hostel[] = [
	// Girls Hostels
	{ name: "Vipasha Girls Hostel", capacity: 71, type: "Girls" },
	{ name: "Iravati Girls Hostel", capacity: 67, type: "Girls" },
	{ name: "Giriganga Girls Hostel", capacity: 67, type: "Girls" },
	{ name: "Chanderbhaga Girls Hostel", capacity: 78, type: "Girls" },
	{ name: "Gargi Girls Hostel", capacity: 80, type: "Girls" },
	{ name: "RLB Girls Hostel", capacity: 114, type: "Girls" },
	{ name: "Renuka Girls Hostel", capacity: 152, type: "Girls" },
	{ name: "Saraswati Girls Hostel", capacity: 154, type: "Girls" },
	{ name: "Vidyottama Girls hostel", capacity: 189, type: "Girls" },
	// Boys Hostels
	{ name: "Shrikhand Boys Hostel", capacity: 72, type: "Boys" },
	{ name: "Tagore Boys Hostel", capacity: 133, type: "Boys" },
	{ name: "SBS Tribal Boys Hostel", capacity: 204, type: "Boys" },
	{ name: "Dr. Ys PArmar Boys Hostel", capacity: 158, type: "Boys" },
];

export const hostelNames = hostels.map((h) => h.name);
