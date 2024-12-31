export class Encryption {
	private static readonly ALGORITHM = "AES-GCM";
	private static readonly KEY_LENGTH = 256;
	private static readonly IV_LENGTH = 12;
	private static readonly ENCRYPTION_KEY =
		process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "your-fallback-key-here";

	private static async getKey(): Promise<CryptoKey> {
		const encoder = new TextEncoder();
		const keyMaterial = await crypto.subtle.importKey(
			"raw",
			encoder.encode(this.ENCRYPTION_KEY),
			{ name: "PBKDF2" },
			false,
			["deriveBits", "deriveKey"]
		);

		return crypto.subtle.deriveKey(
			{
				name: "PBKDF2",
				salt: encoder.encode("salt"),
				iterations: 100000,
				hash: "SHA-256",
			},
			keyMaterial,
			{ name: this.ALGORITHM, length: this.KEY_LENGTH },
			false,
			["encrypt", "decrypt"]
		);
	}

	static async encrypt(data: string): Promise<string> {
		const key = await this.getKey();
		const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
		const encoder = new TextEncoder();

		const encryptedContent = await crypto.subtle.encrypt(
			{
				name: this.ALGORITHM,
				iv: iv,
			},
			key,
			encoder.encode(data)
		);

		const encryptedContentArray = new Uint8Array(encryptedContent);
		const combinedArray = new Uint8Array(
			iv.length + encryptedContentArray.length
		);
		combinedArray.set(iv);
		combinedArray.set(encryptedContentArray, iv.length);

		return btoa(
			Array.from(combinedArray)
				.map((byte) => String.fromCharCode(byte))
				.join("")
		);
	}

	static async decrypt(encryptedData: string): Promise<string> {
		const key = await this.getKey();
		const decoder = new TextDecoder();
		const data = new Uint8Array(
			atob(encryptedData)
				.split("")
				.map((char) => char.charCodeAt(0))
		);

		const iv = data.slice(0, this.IV_LENGTH);
		const encryptedContent = data.slice(this.IV_LENGTH);

		const decryptedContent = await crypto.subtle.decrypt(
			{
				name: this.ALGORITHM,
				iv: iv,
			},
			key,
			encryptedContent
		);

		return decoder.decode(decryptedContent);
	}
}
