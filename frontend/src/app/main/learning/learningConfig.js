import React from 'react'

export const LearningConfig = {
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
            path     : '/learning',
            component: React.lazy(()=> import('./learning'))
        }
    ]
};

