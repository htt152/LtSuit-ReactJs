import React from 'react'

export const XacNhanNghiConfig = {
    settings: {
        layout: {
            config: {
                footer        : {
                    display: false
                }
            }
        }
    },
    routes  : [
        {
            path     : '/xinnghi/xacnhannghi',
            component: React.lazy(()=> import('./xacNhanNghi'))
        }
    ]
};

