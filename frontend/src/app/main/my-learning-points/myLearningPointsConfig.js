import React from 'react'

export const MyLearningPointsConfig = {
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
            path: '/learning-point',
            component: React.lazy(()=>import ('./myLearningPoints'))
        }
    ]
};

