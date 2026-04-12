export abstract class User {
    protected id: string;
    protected name: string;
    protected email: string;
    protected passwordHash: string;
    protected role: string;

    constructor(id: string, name: string, email: string, passwordHash: string, role: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    // Getters for encapsulation
    public getId(): string { return this.id; }
    public getName(): string { return this.name; }
    public getEmail(): string { return this.email; }
    public getRole(): string { return this.role; }
    
    // Auth method (polymorphic or standard behavior)
    public verifyPassword(hashToCompare: string): boolean {
        // In a real app we would use bcrypt.compare here, but for our OOP model 
        // we keep the core domain agnostic of external libraries where possible
        // or just expose the hash to an Auth service.
        return this.passwordHash === hashToCompare;
    }

    public getPasswordHash(): string {
        return this.passwordHash;
    }
}
