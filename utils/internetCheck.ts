import { promises as dns } from 'dns';

export async function isConnectedToInternet(): Promise<boolean> {
    try {
        await dns.lookup('google.com');
        return true;
    } catch (error) {
        return false;
    }
}