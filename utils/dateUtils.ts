export function passDateToGoogleFormat(d: Date) {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const milliseconds = d.getUTCMilliseconds().toString().padStart(3, '0');
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}.${milliseconds}Z`
}