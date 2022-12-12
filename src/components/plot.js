
import React from "react";
import Plot from "react-plotly.js"

export default function(props){
    /*map plot data from object-list to list */
    const xData = props.data? props.data.map(x =>x.Month): [] 
    /*convert y-values from fahrenheit to celsius */
    const yData = props.data? props.data.map(y =>Math.floor((y.AvgTemperature-32)/1.8)):[]

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
                title: "Month"
            },
            yaxis:{
                title: "Temperature in °C"
            }}} 
      />
    )
}