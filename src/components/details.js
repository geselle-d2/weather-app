import React from "react"
import Plot from "./plot.js"
export default function (props){

    const [plotData, setPlotData] = React.useState()
    const [monthlyData, setMonthlyData] = React.useState()
    const [plotMode, setPlotMode] = React.useState()
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September","October","November","December"]
    const [plotTitle, setPlotTitle] = React.useState()

    /*function requests monthly data of specific year */
    async function getYearSpecificData(yearData){
        try{
            var response = await fetch(`${props.LOCALHOST}/city?city=${encodeURIComponent(props.years[0].City)}&year=${yearData}`)
            const data = await response.json()
            setPlotData(data)
        
            var response2 = await fetch(`${props.LOCALHOST}/months?city=${encodeURIComponent(props.years[0].City)}&year=${yearData}`)
            const data2 = await response2.json()
            setMonthlyData(data2)
            setPlotTitle(props.years[0].City + ` (${yearData})`)    
            setPlotMode("monthly")}
        catch (error){
            console.error(error)
        }
    }    
    /*function requests daily data of a year-specific season */
    async function getSeasonSpecificData(yearData){
        try{
            var response = await fetch(`${props.LOCALHOST}/season?city=${encodeURIComponent(props.years[0].City)}&year=${props.years[0].Year}&start=${yearData[1]}&end=${yearData[2]}`)
            const data = await response.json()
            setPlotData(data)
            setPlotMode("daily")
            setPlotTitle(props.years[0].City + " (" + yearData[0]+" "+props.years[0].Year + ")")
        }
        catch(error){
            console.error(error)
        }
    }
    /*function requests daily data of a year-specific month */
    async function getDailyData(monthData){
            try{
                var response = await fetch(`${props.LOCALHOST}/day?city=${encodeURIComponent(props.years[0].City)}&year=${props.years[0].Year}&month=${monthData}`)
            const data = await response.json()
            setPlotData(data)
            setPlotTitle(`${props.years[0].City} (${monthNames[data[0].Month-1]} ${props.years[0].Year})`)
            setPlotMode("daily")
            }
            catch (error){
                console.error(error)
            }
        }
    /*map city-specific year elements */    
    let mappedYears = props.years.map(year => <div key= {props.years.City} className="YearsElement" onClick={handleClick => 
        {getYearSpecificData(year.Year)
    }
    
    }>{year.Year} ({((year.AvgTemperature-32)/1.8).toFixed(1)}°)</div>)
    
    /*map year-specific month elements */
    let mappedMonths
    monthlyData? mappedMonths = monthlyData.map(dayData => <div className="YearsElement" key={dayData.Month} onClick={handleClick =>{
        getDailyData(dayData.Month)
        
    }}>{monthNames[dayData.Month-1]} ({((dayData.AvgTemperature-32)/1.8).toFixed(1)}°)</div>) : mappedMonths = []
    
    let seasons = [["Winter",1,3], ["Spring",4,6],["Summer",7,9],["Fall",10,12]]
    let mappedSeasons
    monthlyData? mappedSeasons = seasons.map(season => <div className="YearsElement" key={season[0]} onClick={handleClick=>{getSeasonSpecificData(season)}}>{season[0]}</div>) : mappedSeasons=[]


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
            
            {plotData?<div>
                <Plot title={plotTitle} data={plotData} mode={plotMode} />
            </div>:""}
            {plotData? <div><h3>Months</h3></div>:""}
            <div className ="YearsList">
                {mappedMonths}
            </div>
            {plotData? <div>Seasons</div>:""}
            <div className="YearsList">
                {mappedSeasons}
            </div>
        </div>
    )
}