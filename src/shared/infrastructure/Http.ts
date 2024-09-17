export abstract class Http {
    abstract get<T>(url: string, headers?: Record<string, string>): Promise<T>;
}
