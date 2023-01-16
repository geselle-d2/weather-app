
import React from "react";
import Plot from "react-plotly.js"

export default function(props){
    
    /*map plot data from object-list to list */
    const xData = props.data? props.data.map(x => props.mode==="monthly"? x.Month: x.Day): [] 
    /*convert y-values from fahrenheit to celsius */
    const yData = props.data? props.data.map(y =>(y.AvgTemperature-32)/1.8):[]

    return (
        <Plot
        data={[
          {
            x: xData,
            y: yData,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'}
          }
        ]}
        layout={ {width: 640, height: 480, title: props.title,
            xaxis:{
                title: props.mode === "daily"? "Day": "Month"
            },
            yaxis:{
                title: "Temperature in °C"
            }}} 
      />
    )
}