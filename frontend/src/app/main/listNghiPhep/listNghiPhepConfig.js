import React from 'react';

export const ListNghiPhepConfig = {
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
            path     : '/nghiphep',
            component: React.lazy(()=>import ('./listNghiPhep'))
        }
    ]
};

