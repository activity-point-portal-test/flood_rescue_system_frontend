import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaTimes, FaExclamationCircle } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import { Encryption } from "../utils/encryption";

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const EmergencySosModal = ({ isOpen, onClose }: EmergencySosModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Encrypt sensitive data
      const encryptedData = {
        name: await Encryption.encrypt(formData.name),
        phone: await Encryption.encrypt(formData.phone),
        location: await Encryption.encrypt(formData.location),
        description: await Encryption.encrypt(formData.description),
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("emergency_sos")
        .insert([encryptedData]);

      if (error) throw error;

      alert("Emergency SOS sent successfully!");
      onClose();
      setFormData({
        name: "",
        phone: "",
        location: "",
        description: "",
      });
    } catch (error) {
      console.error("Error sending SOS:", error);
      alert("Failed to send SOS. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of the component code...
};

export default EmergencySosModal;
