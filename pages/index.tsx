import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	FaExclamationCircle,
	FaArrowRight,
	FaRobot,
	FaVideo,
	FaBell,
	FaChartPie,
	FaMapMarkerAlt,
	FaChartLine,
	FaPhoneAlt,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Image from "next/image";
import { IMAGES } from "../utils/images";
import EmergencySosModal from "../components/EmergencySosModal";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Encryption } from "../utils/encryption";

// Initialize Supabase client
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Home: NextPage = () => {
	const [isSosModalOpen, setIsSosModalOpen] = useState(false);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const steps = [
		{
			title: "AI Detection",
			description:
				"Advanced computer vision algorithms continuously monitor flood-prone areas",
			color: "blue",
			features: [
				"Real-time video analysis",
				"Human detection & tracking",
				"Situation severity assessment",
			],
		},
		{
			title: "Instant Alert",
			description:
				"Automated alert system notifies rescue teams with critical information",
			color: "red",
			features: [
				"Location coordinates",
				"Emergency level classification",
				"Resource requirement analysis",
			],
		},
		{
			title: "Swift Rescue",
			description:
				"Coordinated rescue operation with real-time updates and navigation",
			color: "green",
			features: [
				"GPS-guided navigation",
				"Team coordination",
				"Status tracking & updates",
			],
		},
	];

	const handleContactSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Encrypt sensitive data
			const encryptedData = {
				name: await Encryption.encrypt(formData.name),
				email: await Encryption.encrypt(formData.email),
				subject: await Encryption.encrypt(formData.subject),
				message: await Encryption.encrypt(formData.message),
				// Add a timestamp in clear text for sorting/filtering
				created_at: new Date().toISOString(),
			};

			const { error } = await supabase
				.from("contact_messages")
				.insert([encryptedData]);

			if (error) throw error;

			// Clear form
			setFormData({
				name: "",
				email: "",
				subject: "",
				message: "",
			});

			alert("Message sent successfully!");
		} catch (error) {
			console.error("Error sending message:", error);
			alert("Failed to send message. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-white">
			<Head>
				<title>Flood Rescue System</title>
				<meta
					name="description"
					content="AI-powered flood victim detection and rescue system"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Navbar />

			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center">
				<div className="absolute inset-0 z-0">
					<Image
						src={IMAGES.hero}
						alt="Flood emergency"
						fill
						className="object-cover brightness-50"
						priority
						sizes="100vw"
						fetchPriority="high"
						onError={(e) => {
							console.error("Error loading image:", e);
							// Optionally set a fallback image
							// e.currentTarget.src = "/images/fallback.jpg";
						}}
					/>
				</div>
				<div className="relative z-10 bg-gradient-to-b from-black/50 via-transparent to-black/50 min-h-screen w-full flex items-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="container mx-auto px-4 text-center"
					>
						<h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
							Flood Rescue System
						</h1>
						<p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-12 drop-shadow-md">
							AI-powered solution for detecting and rescuing flood victims
							quickly and efficiently
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setIsSosModalOpen(true)}
								className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg"
							>
								<FaExclamationCircle className="text-xl" />
								Emergency SOS
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => {
									const element = document.getElementById("unified-platform");
									if (element) {
										const offset = 80; // Height of navbar
										const elementPosition =
											element.getBoundingClientRect().top + window.scrollY;
										const offsetPosition = elementPosition - offset;

										window.scrollTo({
											top: offsetPosition,
											behavior: "smooth",
										});
									}
								}}
								className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-white/20 transition-colors border border-white/20 shadow-lg"
							>
								Learn More
								<FaArrowRight className="text-lg" />
							</motion.button>
						</div>

						{/* Optional: Add scroll indicator */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1, duration: 1 }}
							className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
						>
							<div className="flex flex-col items-center gap-2">
								<span className="text-white/60 text-sm">Scroll to explore</span>
								<motion.div
									animate={{ y: [0, 10, 0] }}
									transition={{ repeat: Infinity, duration: 1.5 }}
									className="w-6 h-10 border-2 border-white/20 rounded-full flex items-center justify-center"
								>
									<div className="w-1.5 h-1.5 bg-white rounded-full" />
								</motion.div>
							</div>
						</motion.div>
					</motion.div>
				</div>
			</section>

			<section
				id="unified-platform"
				className="py-24 bg-gradient-to-b from-white to-gray-50"
			>
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center max-w-3xl mx-auto mb-16"
					>
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Unified Rescue Platform
						</h2>
						<p className="text-gray-600 text-lg">
							A comprehensive system connecting administrators, rescue teams,
							and the public for effective flood emergency response.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{/* Admin Card */}
						<motion.div
							whileHover={{ y: -8 }}
							className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden"
						>
							<div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full" />
							<h3 className="text-2xl font-bold text-gray-900 mb-4">
								Administrators
							</h3>
							<p className="text-gray-600 mb-6">
								Coordinate rescue operations, manage resources, and oversee
								emergency response strategies.
							</p>
							<div className="text-blue-600 font-medium">
								Command Center Access →
							</div>
						</motion.div>

						{/* Rescue Team Card */}
						<motion.div
							whileHover={{ y: -8 }}
							className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden"
						>
							<div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full" />
							<h3 className="text-2xl font-bold text-gray-900 mb-4">
								Rescue Teams
							</h3>
							<p className="text-gray-600 mb-6">
								Access real-time alerts, victim locations, and AI-powered
								detection system for swift rescue operations.
							</p>
							<div className="text-green-600 font-medium">
								Rescue Dashboard →
							</div>
						</motion.div>

						{/* Public User Card */}
						<motion.div
							whileHover={{ y: -8 }}
							className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden"
						>
							<div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full" />
							<h3 className="text-2xl font-bold text-gray-900 mb-4">
								Public Users
							</h3>
							<p className="text-gray-600 mb-6">
								Stay informed with real-time flood alerts, emergency contacts,
								and safety guidelines during floods.
							</p>
							<div className="text-purple-600 font-medium">Public Portal →</div>
						</motion.div>
					</div>
				</div>
			</section>

			<main className="container mx-auto px-4">
				{/* Features Section */}
				<section id="features" className="py-24 bg-white">
					<div className="container mx-auto px-4">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="text-center max-w-3xl mx-auto mb-16"
						>
							<h2 className="text-3xl font-bold text-gray-900 mb-4">
								Key Features
							</h2>
							<p className="text-gray-600 text-lg">
								Advanced technology and intelligent systems working together to
								save lives during flood emergencies
							</p>
						</motion.div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
							{/* AI Detection */}
							<motion.div
								whileHover={{ y: -8 }}
								className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
							>
								<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
									<FaRobot className="text-2xl text-blue-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">
									AI-Powered Detection
								</h3>
								<p className="text-gray-600">
									Real-time victim detection using advanced computer vision and
									machine learning algorithms
								</p>
							</motion.div>

							{/* Real-time Monitoring */}
							<motion.div
								whileHover={{ y: -8 }}
								className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
							>
								<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
									<FaVideo className="text-2xl text-green-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">
									Real-time Monitoring
								</h3>
								<p className="text-gray-600">
									24/7 surveillance and monitoring of flood-prone areas with
									instant alerts
								</p>
							</motion.div>

							{/* Emergency Response */}
							<motion.div
								whileHover={{ y: -8 }}
								className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
							>
								<div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
									<FaBell className="text-2xl text-red-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">
									Quick Response System
								</h3>
								<p className="text-gray-600">
									Immediate alert dispatch to rescue teams with location and
									severity details
								</p>
							</motion.div>

							{/* Resource Management */}
							<motion.div
								whileHover={{ y: -8 }}
								className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
							>
								<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
									<FaChartPie className="text-2xl text-purple-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">
									Resource Management
								</h3>
								<p className="text-gray-600">
									Efficient allocation and tracking of rescue resources and
									personnel
								</p>
							</motion.div>

							{/* GPS Integration */}
							<motion.div
								whileHover={{ y: -8 }}
								className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
							>
								<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
									<FaMapMarkerAlt className="text-2xl text-yellow-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">
									GPS Integration
								</h3>
								<p className="text-gray-600">
									Precise location tracking and navigation for rescue operations
								</p>
							</motion.div>

							{/* Data Analytics */}
							<motion.div
								whileHover={{ y: -8 }}
								className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
							>
								<div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
									<FaChartLine className="text-2xl text-cyan-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">
									Data Analytics
								</h3>
								<p className="text-gray-600">
									Advanced analytics for better decision-making and resource
									optimization
								</p>
							</motion.div>
						</div>
					</div>
				</section>

				{/* About Section with side image */}
				<section id="about" className="py-24">
					<div className="container mx-auto px-4">
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.8 }}
							className="grid md:grid-cols-2 gap-12 items-center"
						>
							{/* Left side - Image with overlay */}
							<div className="relative h-[500px] rounded-2xl overflow-hidden group">
								<Image
									src={IMAGES.about}
									alt="Emergency response team"
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									sizes="(max-width: 768px) 100vw, 50vw"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
								<div className="absolute bottom-0 left-0 right-0 p-6 text-white">
									<h3 className="text-2xl font-bold mb-2">
										Emergency Response
									</h3>
									<p className="text-blue-100">
										Saving lives with advanced technology
									</p>
								</div>
							</div>

							{/* Right side - Content */}
							<div className="space-y-8">
								<div>
									<h4 className="text-blue-600 font-semibold mb-2">
										About Our System
									</h4>
									<h2 className="text-3xl font-bold text-gray-900 mb-4">
										Next-Generation Flood Rescue Technology
									</h2>
									<p className="text-gray-600 text-lg leading-relaxed">
										Our AI-powered system revolutionizes flood rescue operations
										through real-time monitoring, instant detection, and
										automated response coordination.
									</p>
								</div>

								{/* Stats Grid */}
								<div className="grid grid-cols-2 gap-6">
									<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
										<div className="text-3xl font-bold text-blue-600 mb-1">
											60%
										</div>
										<div className="text-sm text-gray-600">Faster Response</div>
									</div>
									<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
										<div className="text-3xl font-bold text-blue-600 mb-1">
											95%
										</div>
										<div className="text-sm text-gray-600">Detection Rate</div>
									</div>
									<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
										<div className="text-3xl font-bold text-blue-600 mb-1">
											24/7
										</div>
										<div className="text-sm text-gray-600">Monitoring</div>
									</div>
									<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
										<div className="text-3xl font-bold text-blue-600 mb-1">
											100+
										</div>
										<div className="text-sm text-gray-600">Lives Saved</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</section>

				{/* How It Works Section */}
				<section
					id="how-it-works"
					className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50"
				>
					<div className="container mx-auto px-4">
						{/* Section Header */}
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.8 }}
							className="text-center max-w-3xl mx-auto mb-24"
						>
							<h2 className="text-3xl font-bold text-gray-900 mb-4">
								How It Works
							</h2>
							<p className="text-gray-600 text-lg">
								Our advanced system works seamlessly to ensure rapid detection
								and rescue operations
							</p>
						</motion.div>

						{/* Process Steps Container */}
						<div className="relative max-w-5xl mx-auto">
							{/* Connecting Line - Adjusted position to middle */}
							<motion.div
								initial={{ scaleX: 0 }}
								whileInView={{ scaleX: 1 }}
								transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
								className="absolute top-[45%] left-[20%] right-[20%] h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 transform origin-left hidden lg:block"
							/>

							{/* Process Steps */}
							<div className="grid lg:grid-cols-3 gap-16 relative">
								{steps.map((step, index) => (
									<motion.div
										key={step.title}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5, delay: index * 0.2 }}
										className="relative pt-10"
									>
										<motion.div
											initial={{ scale: 0.8, opacity: 0 }}
											whileInView={{ scale: 1, opacity: 1 }}
											whileHover={{
												scale: 1.02,
												boxShadow:
													"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
											}}
											transition={{
												duration: 0.4,
												delay: index * 0.2 + 0.3,
												hover: { duration: 0.2 },
											}}
											className={`bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative hover:border-${step.color}-200`}
										>
											{/* Number Badge */}
											<div
												className={`w-16 h-16 bg-gradient-to-br from-${step.color}-400 to-${step.color}-600 rounded-xl flex items-center justify-center shadow-lg absolute -top-8 left-1/2 transform -translate-x-1/2`}
											>
												<span className="text-2xl font-bold text-white">
													{String(index + 1).padStart(2, "0")}
												</span>
											</div>

											{/* Content */}
											<div className="pt-8">
												<h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
													{step.title}
												</h3>
												<div className="space-y-4">
													<p className="text-gray-600 text-center">
														{step.description}
													</p>
													<ul className="space-y-2 text-gray-500">
														{step.features.map((feature, i) => (
															<li key={i} className="flex items-center gap-2">
																<div
																	className={`w-1.5 h-1.5 bg-${step.color}-500 rounded-full`}
																/>
																<span>{feature}</span>
															</li>
														))}
													</ul>
												</div>
											</div>
										</motion.div>
									</motion.div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Contact Section with modern design */}
				<section id="contact" className="py-24 relative overflow-hidden">
					{/* Background Pattern */}
					<div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50 opacity-50" />
					<div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.2]" />

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.8 }}
						className="max-w-4xl mx-auto px-4 relative"
					>
						{/* Section Header */}
						<div className="text-center mb-16">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
							>
								<span className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-2 block">
									Get in Touch
								</span>
								<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
									Contact Us
								</h2>
								<p className="text-gray-600 text-lg max-w-2xl mx-auto">
									Need more information about our flood rescue system? We're
									here to help.
								</p>
							</motion.div>
						</div>

						{/* Contact Form Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100 backdrop-blur-sm relative overflow-hidden"
						>
							{/* Decorative Elements */}
							<div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full" />
							<div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-tr-full" />

							<form
								onSubmit={handleContactSubmit}
								className="space-y-6 relative"
							>
								{/* Name and Email row */}
								<div className="grid md:grid-cols-2 gap-6">
									<div className="space-y-1">
										<label className="block text-sm font-medium text-gray-700">
											Your Name <span className="text-red-500">*</span>
										</label>
										<motion.div
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}
										>
											<input
												type="text"
												required
												value={formData.name}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														name: e.target.value,
													}))
												}
												className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
												placeholder="John Doe"
											/>
										</motion.div>
									</div>
									<div className="space-y-1">
										<label className="block text-sm font-medium text-gray-700">
											Email Address <span className="text-red-500">*</span>
										</label>
										<motion.div
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}
										>
											<input
												type="email"
												required
												value={formData.email}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														email: e.target.value,
													}))
												}
												className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
												placeholder="john@example.com"
											/>
										</motion.div>
									</div>
								</div>

								{/* Subject */}
								<div className="space-y-1">
									<label className="block text-sm font-medium text-gray-700">
										Subject <span className="text-red-500">*</span>
									</label>
									<motion.div
										whileHover={{ scale: 1.01 }}
										whileTap={{ scale: 0.99 }}
									>
										<input
											type="text"
											required
											value={formData.subject}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													subject: e.target.value,
												}))
											}
											className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
											placeholder="How can we help you?"
										/>
									</motion.div>
								</div>

								{/* Message */}
								<div className="space-y-1">
									<label className="block text-sm font-medium text-gray-700">
										Message <span className="text-red-500">*</span>
									</label>
									<motion.div
										whileHover={{ scale: 1.01 }}
										whileTap={{ scale: 0.99 }}
									>
										<textarea
											required
											rows={4}
											value={formData.message}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													message: e.target.value,
												}))
											}
											className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 resize-none"
											placeholder="Write your message here..."
										/>
									</motion.div>
								</div>

								{/* Footer with Submit Button and Contact Info */}
								<div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
									<motion.button
										type="submit"
										disabled={isSubmitting}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center gap-2 group"
									>
										{isSubmitting ? (
											<>
												<span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
												<span>Sending...</span>
											</>
										) : (
											<>
												<span>Send Message</span>
												<motion.span
													animate={{ x: [0, 4, 0] }}
													transition={{ repeat: Infinity, duration: 1.5 }}
												>
													→
												</motion.span>
											</>
										)}
									</motion.button>

									{/* Contact Info Card */}
									<div className="bg-blue-50 px-6 py-3 rounded-lg flex items-center gap-4">
										<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
											<FaPhoneAlt className="text-blue-600" />
										</div>
										<div>
											<p className="text-sm text-gray-600">Emergency Hotline</p>
											<a
												href="tel:+917736779102"
												className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
											>
												+91 77367 79102
											</a>
										</div>
									</div>
								</div>
							</form>
						</motion.div>
					</motion.div>
				</section>
			</main>

			{/* Footer with blue gradient */}
			<footer className="bg-gradient-to-br from-blue-500 to-blue-600">
				<div className="container mx-auto px-4 py-8">
					<div className="text-center text-white">
						<p>&copy; 2024 Flood Rescue System. All rights reserved.</p>
					</div>
				</div>
			</footer>

			<EmergencySosModal
				isOpen={isSosModalOpen}
				onClose={() => setIsSosModalOpen(false)}
			/>
		</div>
	);
};

export default Home;
