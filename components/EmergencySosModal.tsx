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
      // Non-sensitive data stored normally
      people_count: formData.peopleCount,
      water_level: formData.waterLevel,
      medical_help_needed: formData.medicalHelp,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("emergency_sos")
      .insert([encryptedData]);

    if (error) throw error;

    alert("Emergency SOS sent successfully!");
    resetForm();
    onClose();
  } catch (error) {
    console.error("Error sending SOS:", error);
    alert("Failed to send SOS. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};
