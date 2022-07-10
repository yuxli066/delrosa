import httpCommon from "./httpCommon";

export const sendEmail = (email) => httpCommon
    .post("sendEmail", email)
    .then((res) => {
        if (res.status === 200) {
            return res.data;
        }
    })
    .catch((err) => 
        console.error(err)
    );

export const createAppointment = (apptTimes) => httpCommon
    .post("createAppointment", apptTimes)
    .then((res) => {
        if (res.status === 200) {
            return res.data;
        }
    })
    .catch((err) => 
        console.error(err)
    );

export const checkAvailability = () => httpCommon
    .get("checkAvailability")
    .then((res) => {
        if (res.status === 200) {
            return res.data;
        }
    })
    .catch((err) => 
        console.error(err)
    );