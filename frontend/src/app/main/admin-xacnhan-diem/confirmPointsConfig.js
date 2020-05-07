import React from 'react'

export const ConfirmPointsConfig = {
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
            path: '/confirm-point',
            component: React.lazy(()=> import('./confirmPoints'))
        }
    ]
};