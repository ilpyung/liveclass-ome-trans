import * as moment from "moment-timezone";
import { readdir, stat, unlink, rm, readFile, writeFile, mkdir } from "fs/promises";
export function randomString(len: number) {
    const charSet = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let randomString = "";
    for (let i = 0; i < len; i++) {
        const randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

export async function createDir(dir: string) {
    try {
        await stat(dir);
    } catch (error) {
        await mkdir(dir, { recursive: true });
    }
}

export async function getDirs(dir: string) {
    const dirs = await readdir(dir);
    const returnDirs = [];
    for (const file of dirs) {
        const result = await stat(dir + "/" + file);
        if (result.isDirectory()) returnDirs.push(file);
    }
    return returnDirs;
}

export async function getFilesCount(dir: string) {
    const dirs = await readdir(dir);
    return dirs.length;
}

export async function getFiles(dir: string, onlySufix?: string) {
    const diffTime = 15000;
    const files = await readdir(dir);
    const returnFiles = [];
    for (const file of files) {
        if (onlySufix && !file.endsWith(onlySufix)) continue;
        const result = await stat(dir + "/" + file);
        let date = new Date();
        let diff = date.getTime() - Number(result.ctime);
        if (diff >= diffTime) returnFiles.push(file);
    }
    return returnFiles;
}

export async function isExsist(dir: string) {
    try {
        await stat(dir);
        return true;
    } catch (error) {
        return false;
    }
}

export function getLeavedateFromTodayWithMoment(date: Date) {
    const today = moment();
    const leavedate = moment(date);
    const diff = leavedate.diff(today, "days");
    return diff;
}

export function checkPassDate(now: string, userdate: string, month: number) {
    const nowDate = new Date(now);
    const userDate = new Date(userdate);
    userDate.setMonth(userDate.getMonth() + month);
    if (nowDate > userDate) return false;
    return true;
}

export function checkPassDateForNow(userDate: Date) {
    const nowDate = new Date();
    if (nowDate > userDate) return false;
    return true;
}

export function getTime(utc = false) {
    if (utc) return moment().format("YYYY-MM-DD HH:mm:ss"); // '2016-05-01 20:14:28 +0900'

    return moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"); // '2016-05-01 20:14:28 +0900'
}

export function getTimeAddDay(day: number) {
    return new Date(moment().add(day, "days").format("YYYY-MM-DD 23:59:59")); // '2016-05-01 20:14:28 +0900'
}

export function getTimeAddMin(min: number, time?: string) {
    return moment(time).add(min, "minutes").format("YYYY-MM-DD HH:mm:ss"); // '2016-05-01 20:14:28 +0900'
}

export function getTimeUnix(utc = false) {
    if (utc) return moment().unix(); // '2016-05-01 20:14:28 +0900'

    return moment().tz("Asia/Seoul").unix();
}
export function getTimeFromTime(time: Date | string) {
    return moment(time).format("YYYY-MM-DD HH:mm:ss");
}
export function getTimeUnixFromTime(time: Date | string) {
    return moment(time).unix();
}

export function checkAndFilterUnixTime(fTime: string, eTime: string, comDay: number) {
    if (eTime.split(" ").length == 1) {
        eTime = eTime + " 23:59:59";
    }
    let fdate = new Date(fTime).getTime();
    let edate = new Date(eTime).getTime();
    const oneMonthAfterFdate = new Date(fTime);
    oneMonthAfterFdate.setDate(oneMonthAfterFdate.getDate() + comDay);
    if (edate - fdate > oneMonthAfterFdate.getTime() - fdate) return false;
    fdate = Number(String(fdate).slice(0, -3));
    edate = Number(String(edate).slice(0, -3));
    return { fdate, edate };
}

export function isEmpty(value: any) {
    if (value === null) return true;
    if (typeof value === "undefined") return true;
    if (typeof value === "string" && value === "") return true;
    if (Array.isArray(value) && value.length < 1) return true;
    if (
        typeof value === "object" &&
        value.constructor.name === "Object" &&
        Object.keys(value).length < 1 &&
        Object.getOwnPropertyNames(value).length < 1
    )
        return true;
    if (typeof value === "object" && value.constructor.name === "String" && Object.keys(value).length < 1) return true; // new String()

    return false;
}

export function sleepBetween0And120() {
    const time = Math.floor(Math.random() * 120) + 0;
    return new Promise(resolve => setTimeout(resolve, time * 1000));
}

export function changeLetterNumber(value: string) {
    const letterNumber = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
        f: 5,
        g: 6,
        h: 7,
        i: 8,
        j: 9,
        k: 10,
        l: 11,
        m: 12,
        n: 13,
        o: 14,
        p: 15,
        q: 16,
        r: 17,
        s: 18,
        t: 19,
        u: 20,
        v: 21,
        w: 22,
        x: 23,
        y: 24,
        z: 25,
    };
    let result = "";
    for (let i = 0; i < value.length; i++) {
        const char = value[i];
        if (isNumber(Number(char))) {
            result += String(char);
            continue;
        }
        if (!letterNumber.hasOwnProperty(char)) continue;
        result += String(letterNumber[char]);
    }

    return Number(result);
}

export function isNumber(value: any) {
    return typeof value === "number" && isFinite(value);
}

export function randomPickInArray<T>(array: T[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const deepClone = (obj: any) => {
    if (obj === null) return null;
    let clone = { ...obj };
    Object.keys(clone).forEach(key => (clone[key] = typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key]));
    return Array.isArray(obj) && obj.length
        ? (clone.length = obj.length) && Array.from(clone)
        : Array.isArray(obj)
        ? Array.from(obj)
        : clone;
};
