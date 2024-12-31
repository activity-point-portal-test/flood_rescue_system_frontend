import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaExclamationCircle } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import { encryptData } from "../utils/encryption";

interface EmergencySosModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const EmergencySosModal = ({ isOpen, onClose }: EmergencySosModalProps) => {
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		location: "",
		peopleCount: "1",
		waterLevel: "",
		medicalHelp: false,
		description: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	// Prevent background scrolling when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		// Cleanup when component unmounts
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	const handleGetLocation = () => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setUserLocation({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
					setFormData((prev) => ({
						...prev,
						location: `${position.coords.latitude}, ${position.coords.longitude}`,
					}));
				},
				(error) => {
					console.error("Error getting location:", error);
				}
			);
		}
	};

	// Add a reset function
	const resetForm = () => {
		setFormData({
			name: "",
			phone: "",
			location: "",
			peopleCount: "1",
			waterLevel: "",
			medicalHelp: false,
			description: "",
		});
		setUserLocation(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Encrypt sensitive data
			const sensitiveData = {
				name: formData.name,
				phone: formData.phone,
				location: formData.location,
				description: formData.description,
			};

			const encryptedData = encryptData(sensitiveData);

			// Data to be stored
			const emergencyData = {
				encrypted_data: encryptedData,
				// Non-sensitive data stored normally for filtering/querying
				people_count: formData.peopleCount,
				water_level: formData.waterLevel,
				medical_help_needed: formData.medicalHelp,
				status: "pending",
				created_at: new Date().toISOString(),
			};

			const { error } = await supabase
				.from("emergency_sos")
				.insert([emergencyData]);

			if (error) throw error;

			alert("Emergency SOS sent successfully!");
			resetForm(); // Reset form after successful submission
			onClose();
		} catch (error) {
			console.error("Error submitting SOS:", error);
			alert("Failed to send Emergency SOS. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		const testConnection = async () => {
			const { data, error } = await supabase
				.from("emergency_sos")
				.select("*")
				.limit(1);

			console.log("Test connection:", { data, error });
		};

		testConnection();
	}, []);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
						onClick={onClose}
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="fixed left-0 right-0 top-0 md:inset-0 md:flex md:items-center md:justify-center w-full h-full z-50"
					>
						<div className="bg-white h-full md:h-auto md:w-[500px] md:max-h-[90vh] md:rounded-xl shadow-2xl overflow-hidden flex flex-col">
							{/* Header */}
							<div className="bg-red-600 p-6 flex items-center justify-between sticky top-0 z-10 shrink-0">
								<div className="flex items-center gap-3">
									<FaExclamationCircle className="text-white text-2xl" />
									<h2 className="text-xl font-bold text-white">
										Emergency SOS
									</h2>
								</div>
								<button
									onClick={onClose}
									className="text-white/80 hover:text-white transition-colors"
								>
									<FaTimes size={24} />
								</button>
							</div>

							{/* Scrollable content area */}
							<div className="flex-1 overflow-y-auto">
								<form onSubmit={handleSubmit} className="p-6 space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Your Name *
										</label>
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
											className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
											placeholder="Enter your name"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Phone Number *
										</label>
										<input
											type="tel"
											required
											value={formData.phone}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													phone: e.target.value,
												}))
											}
											className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
											placeholder="Enter your phone number"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Location
										</label>
										<div className="flex gap-2">
											<input
												type="text"
												value={formData.location}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														location: e.target.value,
													}))
												}
												className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
												placeholder="Your location"
											/>
											<button
												type="button"
												onClick={handleGetLocation}
												className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
											>
												Get Location
											</button>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Number of People Affected *
										</label>
										<select
											required
											value={formData.peopleCount}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													peopleCount: e.target.value,
												}))
											}
											className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
										>
											{[1, 2, 3, 4, 5, "6+"].map((num) => (
												<option key={num} value={num}>
													{num}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Water Level Estimation *
										</label>
										<select
											required
											value={formData.waterLevel}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													waterLevel: e.target.value,
												}))
											}
											className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
										>
											<option value="">Select water level</option>
											<option value="ankle">Ankle Deep</option>
											<option value="knee">Knee Deep</option>
											<option value="waist">Waist Deep</option>
											<option value="chest">Chest Deep</option>
											<option value="above">Above Head</option>
										</select>
									</div>

									<div className="flex items-center gap-2">
										<input
											type="checkbox"
											id="medicalHelp"
											checked={formData.medicalHelp}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													medicalHelp: e.target.checked,
												}))
											}
											className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
										/>
										<label
											htmlFor="medicalHelp"
											className="text-sm font-medium text-gray-700"
										>
											Medical assistance needed
										</label>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Emergency Details *
										</label>
										<textarea
											required
											value={formData.description}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													description: e.target.value,
												}))
											}
											className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[100px]"
											placeholder="Describe the emergency situation (e.g., trapped in building, need evacuation, etc.)"
										/>
									</div>

									<div className="pt-4">
										<button
											type="submit"
											disabled={isSubmitting}
											className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
										>
											{isSubmitting ? "Sending..." : "Send Emergency SOS"}
										</button>
									</div>

									<p className="text-sm text-gray-500 text-center mt-4">
										Need more features?{" "}
										<button
											type="button"
											className="text-blue-600 hover:underline"
										>
											Log in
										</button>{" "}
										to access additional emergency services.
									</p>
								</form>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default EmergencySosModal;
