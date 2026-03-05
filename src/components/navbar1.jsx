import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import vertooneLogo from "../assets/logo-dark.png";
const menu = [
	{
		title: "Products",
		url: "/products"
	},
	{
		accessibleTitle: "Cart",
		url: "/products",
		icon: <ShoppingCart />
	}
];

const auth = {
	login: { title: "Login", url: "/login" },
	signup: { title: "Sign up", url: "/register" }
};

const Navbar1 = ({ className }) => {
	const [search, setSearch] = useState("");

	const [mobileOpen, setMobileOpen] = useState(false);
	console.log(mobileOpen);
	const navigate = useNavigate();
	const handleSearch = (e) => {
		e.preventDefault();
		if (search.trim()) {
			navigate(`/products?search=${encodeURIComponent(search.trim())}`);
			setSearch("");
			setMobileOpen(false);
		}
	};
	return (
		<section className={cn("py-4 px-2", className)}>
			<div className="container max-w-8xl mx-auto">
				{/* Desktop Menu */}
				<nav className="hidden items-center justify-between lg:flex">
					<div className="flex items-center gap-6">
						{/* Logo */}
						<a href={"/"} className="flex items-center gap-2">
							<img src={vertooneLogo} className="max-h-8 dark:invert" alt="Vertoone Logo" />
						</a>
					</div>
					<SearchBar search={search} setSearch={setSearch} handleSearch={handleSearch} />
					<div className="flex items-center gap-2">
						<div className="flex items-center">
							<NavigationMenu>
								<NavigationMenuList>{menu.map((item) => renderMenuItem(item))}</NavigationMenuList>
							</NavigationMenu>
						</div>
						<Button asChild variant="outline" size="sm">
							<a href={auth.login.url}>{auth.login.title}</a>
						</Button>
						<Button asChild size="sm">
							<a href={auth.signup.url}>{auth.signup.title}</a>
						</Button>
					</div>
				</nav>

				{/* Mobile Menu */}
				<div className="block lg:hidden">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<a href={"/"} className="flex items-center gap-2">
							<img src={vertooneLogo} className="max-h-8 dark:invert" alt="Vertoone Logo" />
						</a>
						<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
							<SheetTrigger asChild>
								<Button variant="outline" size="icon">
									<Menu className="size-4" />
								</Button>
							</SheetTrigger>
							<SheetContent className="overflow-y-auto w-full">
								<SheetHeader>
									<SheetTitle>
										<a href={"/"} className="flex items-center gap-2">
											<img src={vertooneLogo} className="max-h-8 dark:invert" alt="Vertoone Logo" />
										</a>
									</SheetTitle>
								</SheetHeader>
								<div className="flex flex-col gap-6 p-4">
									<SearchBar search={search} setSearch={setSearch} handleSearch={handleSearch} classNames={"w-full"} />
									<Accordion type="single" collapsible className="flex w-full flex-col gap-4">
										{menu.map((item) => renderMobileMenuItem(item))}
									</Accordion>

									<div className="flex flex-col gap-3">
										<Button asChild variant="outline">
											<a href={auth.login.url}>{auth.login.title}</a>
										</Button>
										<Button asChild>
											<a href={auth.signup.url}>{auth.signup.title}</a>
										</Button>
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</section>
	);
};

const renderMenuItem = (item) => {
	if (item.items) {
		return (
			<NavigationMenuItem key={item.title}>
				<NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
				<NavigationMenuContent className="bg-popover text-popover-foreground">
					{item.items.map((subItem) => (
						<NavigationMenuLink asChild key={subItem.title} className="w-80">
							<SubMenuLink item={subItem} />
						</NavigationMenuLink>
					))}
				</NavigationMenuContent>
			</NavigationMenuItem>
		);
	}

	return (
		<NavigationMenuItem key={item.title || item.accessibleTitle}>
			<NavigationMenuLink
				href={item.url}
				className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-2 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
			>
				{item.title} {item.icon && <span className={`${item.title && "ml-2"}`}>{item.icon}</span>}
			</NavigationMenuLink>
		</NavigationMenuItem>
	);
};

const renderMobileMenuItem = (item) => {
	if (item.items) {
		return (
			<AccordionItem
				key={item.title || item.accessibleTitle}
				value={item.title || item.accessibleTitle}
				className="border-b-0"
			>
				<AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
					{item.title || item.accessibleTitle}
				</AccordionTrigger>
				<AccordionContent className="mt-2">
					{item.items.map((subItem) => (
						<SubMenuLink key={subItem.title || subItem.accessibleTitle} item={subItem} />
					))}
				</AccordionContent>
			</AccordionItem>
		);
	}

	return (
		<a key={item.title || item.accessibleTitle} href={item.url} className="text-md font-semibold">
			{item.title || item.accessibleTitle}
		</a>
	);
};

const SubMenuLink = ({ item }) => {
	return (
		<a
			className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
			href={item.url}
		>
			<div className="text-foreground">{item.icon}</div>
			<div>
				<div className="text-sm font-semibold">{item.title}</div>
				{item.description && <p className="text-sm leading-snug text-muted-foreground">{item.description}</p>}
			</div>
		</a>
	);
};

const SearchBar = ({ search, setSearch, handleSearch, classNames }) => {
	return (
		<div className="flex items-center gap-2">
			{/* Search bar */}
			<form onSubmit={handleSearch} className="relative w-full">
				<input
					type="text"
					placeholder="Search products..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className={cn(
						"w-100 pl-4 pr-12 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-sm",
						classNames
					)}
				/>
				<button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
					<FaSearch />
				</button>
			</form>
		</div>
	);
};

export { Navbar1 };

