import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronRight, FaArrowUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [showTopButton, setShowTopButton] = useState(false);

	// Handle navbar background and top button visibility on scroll
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
			setShowTopButton(window.scrollY > 500); // Show button after scrolling 500px
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToSection = (sectionId: string) => {
		setIsOpen(false);
		const element = document.getElementById(sectionId);
		if (element) {
			const offset = 80; // Height of navbar
			const bodyRect = document.body.getBoundingClientRect().top;
			const elementRect = element.getBoundingClientRect().top;
			const elementPosition = elementRect - bodyRect;
			const offsetPosition = elementPosition - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<>
			<nav
				className={`fixed w-full z-50 transition-all duration-300 ${
					isScrolled
						? "bg-white/80 backdrop-blur-md shadow-lg"
						: "bg-transparent"
				}`}
			>
				<div className="container mx-auto px-4">
					<div className="flex justify-between items-center h-20">
						{/* Logo */}
						<Link href="/">
							<div className="flex items-center space-x-2">
								<span
									className={`text-2xl font-bold transition-colors duration-300 ${
										isScrolled ? "text-blue-600" : "text-white"
									}`}
								>
									FRS
								</span>
							</div>
						</Link>

						{/* Desktop Menu */}
						<div className="hidden md:flex items-center space-x-8">
							{["About", "Features", "How It Works", "Contact"].map((item) => (
								<button
									key={item}
									onClick={() =>
										scrollToSection(item.toLowerCase().replace(/\s+/g, "-"))
									}
									className={`transition-colors duration-300 ${
										isScrolled
											? "text-gray-600 hover:text-blue-600"
											: "text-white/90 hover:text-white"
									}`}
								>
									{item}
								</button>
							))}
							<Link href="/login">
								<span
									className={`px-4 py-2 rounded-lg transition-all duration-300 ${
										isScrolled
											? "bg-blue-600 text-white hover:bg-blue-700"
											: "bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
									}`}
								>
									Login
								</span>
							</Link>
						</div>

						{/* Mobile Menu Button */}
						<button
							className={`md:hidden transition-colors duration-300 p-2 rounded-lg ${
								isScrolled ? "text-blue-600" : "text-white"
							}`}
							onClick={() => setIsOpen(!isOpen)}
							aria-label="Toggle menu"
						>
							{isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
						</button>
					</div>
				</div>

				{/* New Mobile Menu */}
				<AnimatePresence>
					{isOpen && (
						<>
							{/* Backdrop */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
								onClick={() => setIsOpen(false)}
							/>

							{/* Menu Panel */}
							<motion.div
								initial={{ x: "100%" }}
								animate={{ x: 0 }}
								exit={{ x: "100%" }}
								transition={{ type: "spring", bounce: 0, duration: 0.4 }}
								className="fixed right-0 top-0 h-screen w-[300px] bg-white shadow-2xl md:hidden"
							>
								<div className="flex flex-col h-full">
									{/* Menu Header */}
									<div className="flex justify-between items-center p-5 border-b">
										<span className="text-xl font-bold text-blue-600">
											Menu
										</span>
										<button
											onClick={() => setIsOpen(false)}
											className="p-2 text-gray-500 hover:text-gray-700"
										>
											<FaTimes size={20} />
										</button>
									</div>

									{/* Menu Items */}
									<div className="flex-1 overflow-y-auto py-4">
										{["About", "Features", "How It Works", "Contact"].map(
											(item) => (
												<button
													key={item}
													onClick={() =>
														scrollToSection(
															item.toLowerCase().replace(/\s+/g, "-")
														)
													}
													className="w-full px-5 py-4 flex items-center justify-between text-gray-600 hover:bg-gray-50 transition-colors"
												>
													<span className="text-lg">{item}</span>
													<FaChevronRight className="text-gray-400" size={14} />
												</button>
											)
										)}
									</div>

									{/* Menu Footer */}
									<div className="p-5 border-t">
										<Link href="/login" onClick={() => setIsOpen(false)}>
											<span className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors">
												Login
											</span>
										</Link>
									</div>
								</div>
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</nav>

			{/* Back to Top Button */}
			<AnimatePresence>
				{showTopButton && (
					<motion.button
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
						onClick={scrollToTop}
						className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
						aria-label="Scroll to top"
					>
						<FaArrowUp size={20} />
					</motion.button>
				)}
			</AnimatePresence>
		</>
	);
};

export default Navbar;
