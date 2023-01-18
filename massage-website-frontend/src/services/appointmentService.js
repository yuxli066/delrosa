import httpCommon from "./httpCommon";

export const sendEmail = (email) => httpCommon
    .post("sendEmail", email)
    .then((res) => {
        console.log(res)
        if (res.status === 200) {
            return res.data;
        }
    })
    .catch((err) => 
        console.error(err)
    );

export const createAppointment = (appointment_info) => httpCommon
    .post("createAppointment", appointment_info)
    .then((res) => {
        if (res.status === 200) {
            return res.data;
        }
    })
    .catch((err) => 
        console.error(err)
    );

export const getAvailability = () => httpCommon
    .get("getAvailability")
    .then((res) => {
        if (res.status === 200) {
            return res.data;
        }
    })
    .catch((err) => 
        console.error(err)
    );