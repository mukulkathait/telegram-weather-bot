export declare class EncryptionUtilityService {
    private readonly ENCRYPTION_KEY;
    private readonly IV_LENGTH;
    encrypt(text: string): string;
    decrypt(text: string): string;
}
