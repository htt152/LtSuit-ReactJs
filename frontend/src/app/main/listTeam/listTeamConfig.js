import React from 'react'

export const ListTeamConfig = {
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
            path: '/listteam',
            component: React.lazy(()=> import('./listTeam'))
        }
    ]
};

