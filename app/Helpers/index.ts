export function logMe(title: string, log: any, prevew = true) {
    if (prevew) {
        console.log(`${title}: ################~~~~~~ `, log)
    }
}

