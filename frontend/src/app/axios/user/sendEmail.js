import api from '../api'
const sendEmail = async (req) => {
    let res
    await api.post('/sendemail', { email: req.email })
        .then((response) => {
            res = response
        })
        .catch((error) => {
            res = error.response
        })
    return res
}

export default sendEmail
