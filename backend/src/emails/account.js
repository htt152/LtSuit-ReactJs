const sgMail = require('@sendgrid/mail')
// const url = 'http://localhost:3000'
const url = 'http://hubcode.nal.vn'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendForgotPassword = (email, id, token, name) => {
    sgMail.send({
        to: email,
        from: 'toiladong1998@gmail.com',
        subject: 'Forgot Password!',
        html: `
            Hi ${name}, Mật khẩu của bạn sẽ được thay đổi khi click vào
            <a href="${url}/change-password?id=${id}&token=${token}">
            Change Password
            </a>
        `
    })
}

const sendNghiPhepUser = (email, userName, nghiTu, nghiDen, lyDoNghi, nguoiLienQuan, anhHuong, khacPhuc) => {
    sgMail.send({
        to: email,
        from: 'toiladong1998@gmail.com',
        subject: 'Thông báo nghỉ phép!',
        html: `
            Chào bạn ${userName}.<br/>
            Hệ thống tiếp nhận nghỉ phép đã tiếp nhận thành công đơn xin nghỉ của bạn với nội dung như dưới.<br/>
            ------------<br/>
            Người xin nghỉ: ${userName}<br/>
            Nghỉ từ: ${nghiTu}<br/>
            Nghỉ đến: ${nghiDen}<br/>
            Lý do nghỉ: ${lyDoNghi}<br/>
            Người liên quan: ${nguoiLienQuan}<br/>
            Mức độ ảnh hưởng: ${anhHuong}<br/>
            Cách khắc phục: ${khacPhuc}<br/>
            ------------<br/><br/>
            Hãy đảm bảo rằng bạn đã bàn giao đầy đủ nội dung công việc cho những người liên quan,
             và cố gắng nhất không ảnh hưởng tới dự án mà bạn đang tham gia triển khai.<br/><br/>
            Mọi ý kiến đóng góp xin gửi về email <br/>
            nghiphep@nal.vn <br/>
            Xin cảm ơn. <br/><br/>
            ------------<br/><br/>
            Email này được gửi tự động từ hệ thống xin nghỉ phép của NAL Group. <br/>
            Để xin nghỉ phép, hoặc xem lịch sử nghỉ phép, vui lòng truy cập: <br/>
            <a href="http://hubcode.nal.vn">http://hubcode.nal.vn</a><br/>
            Đăng nhập bằng tài khoản LDAP.
        `,
    })
}

const sendNghiPhep = (email, user, userName, nghiTu, nghiDen, lyDoNghi, nguoiLienQuan, anhHuong, khacPhuc) => {
    sgMail.send({
        to: email,
        from: 'toiladong1998@gmail.com',
        subject: 'Thông báo nghỉ phép!',
        html: `
            Chào bạn ${user}.<br/>
            Hệ thống tiếp nhận nghỉ phép đã tiếp nhận thành công đơn xin nghỉ của ${userName} với nội dung như dưới.<br/>
            ------------<br/>
            Người xin nghỉ: ${userName}<br/>
            Nghỉ từ: ${nghiTu}<br/>
            Nghỉ đến: ${nghiDen}<br/>
            Lý do nghỉ: ${lyDoNghi}<br/>
            Người liên quan: ${nguoiLienQuan}<br/>
            Mức độ ảnh hưởng: ${anhHuong}<br/>
            Cách khắc phục: ${khacPhuc}<br/>
            ------------<br/><br/>
            Hãy đảm bảo rằng ${userName} đã bàn giao đầy đủ nội dung công việc cho những người liên quan,
             và cố gắng nhất không ảnh hưởng tới dự án mà ${userName} đang tham gia triển khai.<br/><br/>
            Mọi ý kiến đóng góp xin gửi về email <br/>
            nghiphep@nal.vn <br/>
            Xin cảm ơn. <br/><br/>
            ------------<br/><br/>
            Email này được gửi tự động từ hệ thống xin nghỉ phép của NAL Group. <br/>
            Để xin nghỉ phép, hoặc xem lịch sử nghỉ phép, vui lòng truy cập: <br/>
            <a href="http://hubcode.nal.vn">http://hubcode.nal.vn</a><br/>
            Đăng nhập bằng tài khoản LDAP.
        `,
    })
}

module.exports = {
    sendForgotPassword,
    sendNghiPhepUser,
    sendNghiPhep
}