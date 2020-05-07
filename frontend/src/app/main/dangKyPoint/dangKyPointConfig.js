import React from 'react'

export const DangKyPointConfig = {
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
            path: '/dang-ky',
            component: React.lazy(()=> import('./dangKyPoint'))
        }
    ]
};

