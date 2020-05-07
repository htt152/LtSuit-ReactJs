import React from 'react'

export const FormNpConfig = {
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
            path     : '/xinnghi',
            component: React.lazy(()=> import('./FormNp'))
        }
    ]
};

