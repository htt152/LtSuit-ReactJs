import React from 'react'

export const ProfileConfig = {
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
            path     : '/profile',
            component: React.lazy(()=> import('./profile'))
        }
    ]
};

