import Message from './Message'

export const MessageConfig = {
    settings: {
        layout: {
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: false
                },
                footer        : {
                    display: false
                },
                leftSidePanel : {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    // auth    : authRoles.onlyGuest,
    routes  : [
        {
            path     : '/message',
            component: Message
        }
    ]
};

