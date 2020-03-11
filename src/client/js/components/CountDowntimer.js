import React from 'react';
import {Badge} from 'react-bootstrap';


export default class CountdownTimer extends React.Component {
    constructor(prop) {
        super(prop);
        this.state= {
            timeleftinseconds : 0
        }
        this.curr_time = 0;
        this.time_left = 0;
        this.min = 0;
        this.sec = 0;
        this.n ="";
        this.n = prop.text.search(/\d\d:\d\d:\d\d/);
        this.pick_up_eta = prop.text.slice(this.n,this.n+8);
        this.pick_up_eta_ls = prop.text.slice(this.n,this.n+8).split(":");
        this.pick_up_eta = SecondsLeft(this.pick_up_eta_ls);
        this.updatetime=this.updatetime.bind(this);
        //Firguring out time left
    }
        //console.log("prop received as");
        //console.log(prop);
        
        
        //pick_up_eta_ls split of hours, minutes and seconds
        //console.log("time of pickup");
        //console.log(pick_up_eta);
        
        //console.log(pick_up_eta)
        //time_left in seconds
    componentDidMount() {
        this.interval_handler =setInterval(this.updatetime,500);
    }
    updatetime() {
        this.curr_time= new Date();
        //console.log(SecondsLeft([curr_time.getHours(),curr_time.getMinutes(),curr_time.getSeconds()]));
        this.time_left = this.pick_up_eta - SecondsLeft([this.curr_time.getHours(),this.curr_time.getMinutes(),this.curr_time.getSeconds()]);
        //editing elements based on time left
        this.setState({
            timeleftinseconds : this.time_left
        })

        console.log("time to pick up");
        console.log(this.time_left);
        this.min = (this.time_left-this.time_left%60)/60;
        this.sec = this.time_left%60;
        if (this.time_left <= 0) {
            clearInterval(this.interval_handler);
        }
        }
        render() {
            if (this.time_left>600) {
            return <div>Pickup Time: {this.pick_up_eta_ls[0]}:{this.pick_up_eta_ls[1]}{parseInt(this.pick_up_eta_ls[0])>12 ? "PM":"AM"}</div>;
            }
            else if (this.time_left>300){
                return <div>Pickup ETA : <Badge variant="secondary">{this.min}:{this.sec<10 ? "0"+this.sec:this.sec}</Badge></div>;
            }
            else if (this.time_left>0) {
                return <div>Pickup ETA : <Badge variant="danger">{this.min}:{this.sec<10 ? "0"+this.sec:this.sec}</Badge></div>;
            }
            else {
                return <div><Badge variant='danger'>Due Now</Badge></div>
            }
        }
}


function SecondsLeft(prop) {
    return (parseInt(prop[0])*3600+parseInt(prop[1])*60+parseInt(prop[2]))
}