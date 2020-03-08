import React from "react";

export default function TimeForPickUp(order_time,interval) {
    return (new Date(order_time.getTime()+interval*60*60000))

export default function TimeLeft(pickup_time,min=true) {
    time_left = new Date() - pickup_time;
    if (min==true){
        time_left= Math.floor(time_left,60000)
    }
    return (time_left)
}
