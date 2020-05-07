import React from 'react';
import {Typography} from '@material-ui/core';
import {FuseAnimate} from '@fuse';

function Error404Page()
{
    return (
        <div className="flex flex-col flex-1 items-center justify-center p-16">

            <div className="max-w-512 text-center">

                <FuseAnimate animation="transition.expandIn" delay={100}>
                    <Typography variant="h1" color="inherit" className="font-medium mb-16">
                        404
                    </Typography>
                </FuseAnimate>

                <FuseAnimate delay={500}>
                    <Typography variant="h5" color="textSecondary" className="mb-16">
                        Xin lỗi nhưng đường link này không tồn tại
                    </Typography>
                </FuseAnimate>
            </div>
        </div>
    );
}

export default Error404Page;
