export const getTimeOnly = (date: Date, timezone = "Asia/Bangkok") => {
    return new Date(date.toLocaleString('en-US', { timeZone: timezone }))
        .toTimeString()
        .split(' ')[0]; // "HH:MM:SS"
    
};

export const getDateOnly = (date: Date) => {
    return (
        date.getFullYear().toString().padStart(4, "0") +
        "-" +
        (date.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        date.getDate().toString().padStart(2, "0")
    );
};

// from 00:00:00 to 23:59:59 is valid
export const checkIfTimeValid = (time: string) => {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
    return timeRegex.test(time);
};
