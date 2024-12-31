import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCheckCircle } from "react-icons/fa";

interface SystemDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const SystemDetailsModal = ({ isOpen, onClose }: SystemDetailsModalProps) => {
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
						<div className="bg-white h-full md:h-auto md:w-[800px] md:max-h-[90vh] md:rounded-xl shadow-2xl overflow-hidden flex flex-col">
							{/* Header */}
							<div className="bg-blue-600 p-6 flex items-center justify-between sticky top-0 z-10 shrink-0">
								<h2 className="text-xl font-bold text-white">
									About Our System
								</h2>
								<button
									onClick={onClose}
									className="text-white/80 hover:text-white transition-colors"
								>
									<FaTimes size={24} />
								</button>
							</div>

							{/* Content */}
							<div className="flex-1 overflow-y-auto p-6">
								<div className="prose max-w-none">
									{/* Add your detailed content here */}
									<h3>Advanced Technology Integration</h3>
									<p>
										Our system combines cutting-edge AI technology with
										real-time monitoring...
									</p>

									{/* Add more sections as needed */}
								</div>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default SystemDetailsModal;
