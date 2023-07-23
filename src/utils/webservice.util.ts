


export function toBase64(text: string) : string{
    return Buffer.from(text).toString('base64')
}


export function fromBase64(text: string | undefined) : string | undefined {
    if(typeof text === "undefined") return undefined;
    return Buffer.from(text, 'base64').toString();
}


export function isBase64(value: string| undefined): boolean {
    if(typeof value === "undefined") return false;

    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(value);
}
