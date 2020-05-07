import {authRoles} from 'app/auth';

const navigationConfig = [
    {
        'id': 'applications',
        'title': 'Ứng dụng',
        'type': 'group',
        'icon': 'apps',
        'children': [
            {
                'id': 'bang-tin',
                'title': 'Bảng tin',
                'type': 'item',
                'icon': 'dashboard',
                'url': '/example'
            },
            {
                'id': 'dat-phong-hop',
                'title': 'Đặt phòng họp',
                'type': 'item',
                'icon': 'today',
                'url': '/example1'
            },
            {
                'id': 'hoc-tap-va-ren-luyen',
                'title': 'Học tập và rèn luyện',
                'type': 'collapse',
                'icon': 'school',
                'children': [
                    {
                        'id': 'learning-points',
                        'title': 'Điểm học tập của công ty',
                        'type': 'item',
                        'url': '/learning'
                    },
                    {
                        'id': 'my-learning-points',
                        'title': 'Điểm học tập của cá nhân',
                        'type': 'item',
                        'url': '/learning-point'
                    },
                    {
                        'id': 'xac-nhan',
                        'title': 'Xác nhận điểm học tập',
                        'auth' : authRoles.admin,
                        'type': 'item',
                        'url': '/confirm-point'
                    }
                ]
            },
            {
                'id': 'ung-dung-van-phong',
                'title': 'Ứng dụng văn phòng',
                'type': 'collapse',
                'icon': 'layers',
                'children': [
                    {
                        'id': 'nghi-phep',
                        'title': 'Nghỉ phép',
                        'type': 'item',
                        'url': '/nghiphep'
                    },
                    {
                        'id': 'team-building',
                        'title': 'Team building',
                        'type': 'item',
                        'url': '/example4'
                    },
                    {
                        'id': 'thu-vien',
                        'title': 'Thư viện',
                        'type': 'item',
                        'url': '/example5'
                    },
                    {
                        'id': 'lau-hang-ngay',
                        'title': 'Lẩu hàng ngày',
                        'type': 'item',
                        'url': '/example6'
                    },
                    {
                        'id': 'giai-tri-va-thu-gian',
                        'title': 'Giải trí & thư giãn',
                        'type': 'item',
                        'url': '/example7'
                    }
                ]
            },
            {
                'id': 'danh-gia-hieu-suat',
                'title': 'Đánh giá hiệu suất',
                'type': 'item',
                'icon': 'rate_review',
                'url': '/example8'
            },
            {
                'id': 'O-KPI',
                'title': 'O-KPI',
                'type': 'item',
                'icon': 'bar_chart',
                'url': '/example9'
            }
        ]
    }, {
        'id': 'information',
        'title': 'Thông tin',
        'type': 'group',
        'icon': 'apps',
        'children': [
            {
                'id': 'thong-tin-ca-nhan',
                'title': 'Thông tin cá nhân',
                'type': 'item',
                'icon': 'person',
                'url': '/profile'
            },
            {
                'id': 'thanh-vien',
                'title': 'Thành viên',
                'type': 'item',
                'icon': 'contact_phone',
                'url': '/thanhvien'
            },
            {
                'id': 'nhom-lam-viec',
                'title': 'Nhóm làm việc',
                'type': 'item',
                'icon': 'group_work',
                'url': '/listteam'
            },
            {
                'id': 'du-an',
                'title': 'Dự án',
                'type': 'item',
                'icon': 'folder_special',
                'url': '/example13'
            }
        ]
    }
];

export default navigationConfig;