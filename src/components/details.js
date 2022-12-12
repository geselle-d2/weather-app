import React from "react"
import Plot from "./plot.js"
export default function (props){

    const [plotData, setPlotData] = React.useState()
    const [avgTemp, setAvgTemp] = React.useState()
    let mappedYears = props.years.map(year => <div className="YearsElement" onClick={handleClick =>{
        /*function requests year specific data for the selected city */
        async function getYearSpecificData(){
            var response = await fetch(`http://localhost:3100/dbinfo/city/${props.years[0].City}/${year.Year}`)
            const data = await response.json()
            setPlotData(data)
            var response2 = await fetch(`http://localhost:3100/dbinfo/city/${props.years[0].City}/${year.Year}/overall`)
            const data2 = await response2.json()
            setAvgTemp(data2)
        }
        getYearSpecificData()
    }
    
    }>{year.Year} ({((year.AvgTemperature-32)/1.8).toFixed(1)}°)</div>)
    
    return(
        <div>
            <div>
                <h3>{props.years? props.years[0].Region:""}</h3>
            </div>
            <div>
                <h1>{props.years? props.years[0].City:""}</h1>
            </div>
            <div className="YearsList">
                {mappedYears? mappedYears:""}  
            </div>
            
            <div>
                <Plot title={props.years && plotData? `${props.years[0].City} (${plotData[0].Year})`:""} data={plotData} />
            </div>
            <div className="SeasonsList">
                <div className="YearsElement">Spring</div>
                <div className="YearsElement">Summer</div>
                <div className="YearsElement">Fall</div>
                <div className="YearsElement">Winter</div>
            </div>
        </div>
    )
}