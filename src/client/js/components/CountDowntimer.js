import React from 'react';
import {Badge} from 'react-bootstrap';


export default function CountdownTimer(prop) {
        //Firguring out time left
        
        console.log("prop received as");
        console.log(prop);
        var n = prop.text.search(/\d\d:\d\d:\d\d/);
        var pick_up_eta = prop.text.slice(n,n+8);
        var pick_up_eta_ls = prop.text.slice(n,n+8).split(":");
        //pick_up_eta_ls split of hours, minutes and seconds
        console.log("time of pickup");
        console.log(pick_up_eta);
        pick_up_eta = SecondsLeft(pick_up_eta_ls);
        console.log(pick_up_eta)
        //time_left in seconds
        var curr_time= new Date();
        console.log(SecondsLeft([curr_time.getHours(),curr_time.getMinutes(),curr_time.getSeconds()]));
        var time_left = pick_up_eta - SecondsLeft([curr_time.getHours(),curr_time.getMinutes(),curr_time.getSeconds()]);
        //editing elements based on time left
        console.log("time to pick up")
        console.log(time_left);
        var min = (time_left-time_left%60)/60;
        var sec = time_left%60;
        if (time_left>600) {
        return <div>Pickup Time: {pick_up_eta_ls[0]}:{pick_up_eta_ls[1]}{parseInt(pick_up_eta_ls[0])>12 ? "PM":"AM"}</div>;
        }
        else if (time_left>300){
            return <div>Pickup ETA : <Badge variant="secondary">{min}:{sec<10 ? "0"+sec:sec}</Badge></div>;
        }
        else if (time_left>0) {
            return <div>Pickup ETA : <Badge variant="danger">{min}:{sec<10 ? "0"+sec:sec}</Badge></div>;
        }
        else {
            this.clearInterval();
            return <div><Badge variant='danger'>Due Now</Badge></div>
        }


function SecondsLeft(prop) {
    return(parseInt(prop[0])*3600+parseInt(prop[1])*60+parseInt(prop[2]))
}