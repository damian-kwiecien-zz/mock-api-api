export class Util {
    static filterSlasheshFromBeginAndEnd(url: string) {
        return url.replace(/^\/+|\/+$/g, '')
    }
}