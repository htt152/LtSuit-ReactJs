import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'


import Typography from '@material-ui/core/Typography'


class Message extends Component {

    render() {
        return (
            <div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left h-full" style={{ backgroundColor: "#2D323E" }} >
                
                    <Paper style={{ padding: '20px 15px', marginTop: '30px', color:"#e84949" }}>
                        <Typography variant="h5" gutterBottom >
                            Check your inbox for the next steps. If you don't receive an email, and it's not in your spam folder this could mean you signed up with a different address.
                        </Typography>

                        <div style={{ textAlign: "center" }}>
                            <a href="http://localhost:3000/login" style={{ textDecoration: "none", fontSize: "15px", alignContent:"center" }}><strong>Back to login</strong></a>
                        </div>
                    </Paper>
            </div>
        )
    }
}

export default Message
