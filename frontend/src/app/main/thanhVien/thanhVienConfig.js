import React from 'react'

export const ThanhVienConfig = {
    settings: {
        layout: {
            config: {
                footer: {
                    display: false
                }
            }
        }
    },
    routes: [
        {
            path: '/thanhvien',
            component: React.lazy(()=> import('./thanhVien'))
        }
    ]
};

