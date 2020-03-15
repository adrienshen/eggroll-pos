import React from "react";
import {Container, Form, Row, Col, Button,Badge} from "react-bootstrap";
//Assuming String
//2020-03-07T21:00:23.758Z
export default function CountDownTimer(prop) {
    setInterval(function(prop){
        //Firguring out time left
        var curr_time= new Date();
        var n = prop.search(/\d\d:\d\d:\d\d/);
        var pick_up_eta_ls = prop.slice(n,n+8).split(":");
        console.log("the time pickedup");
        console.log(pick_up_eta);
        pick_up_eta = SecondsLeft(pick_up_eta_ls);
        console.log(pick_up_eta)
        //time_left in seconds
        var time_left = pick_up_eta - SecondsLeft(curr_time.getHours(),curr_time.getMinutes(),curr_time.getSeconds());
        //editing elements based on time left
        if (time_left>600) {
        return <div>Pickup Time: {pick_up_eta_ls[0]}:{pick_up_eta_lsp[1]}{parseInt(pick_up_eta_ls[0])>12 ? "PM":"AM"}</div>;
        }
        else if (time_left>300){
            return <div>Pickup ETA : <Badge variant="secondary">{Math.floor(time_left,60)}:{time_left%60}</Badge></div>;
        }
        else if (time_left>0) {
            return <div>Pickup ETA : <Badge variant="danger">{Math.floor(time_left,60)}:{time_left%60}</Badge></div>;
        }
        else {
            return <div><Badge variant='danger'>Due Now</Badge></div>
        }




    },1000);
}


function SecondsLeft(prop) {
    return(prop[0]*3600+prop[1]*60+prop[2])
}