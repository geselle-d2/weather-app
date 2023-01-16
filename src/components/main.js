import React from "react"
import Details from "./details"
export default function (){

    const LOCALHOST  = "http://localhost:3100/dbinfo"
    const [region, setRegion] = React.useState([]);
    const [city, setCity] = React.useState()
    const [years, setYears] = React.useState()
    /*Order variables track in which order cities are to be ordered */
    const [alphaOrder, setAlphaOrder] = React.useState(true)
    const [tempOrder, setTempOrder] = React.useState(true)
    const [selectedContinent, setSelectedContinent] = React.useState()
    
    
    /*function requests available continents/region from the given database */
    React.useEffect(function(){
        fetch(`${LOCALHOST}/continents`)
            .then(response => response.json())
            .then(data =>setRegion(data));
    },[])
    /*function requests all unique regions/continents from database */
    async function getRegionsFromDataBase(region){
        try{
            var response = await fetch(`${LOCALHOST}/region?groupBy=City&region=${encodeURIComponent(region)}&orderBy=City&order=ASC`)
        const data= await response.json() 
        setCity(data)
        setSelectedContinent(region)
        }
        catch(error){
            console.error(error)
        }
    }
    /*function requests all city-specific monthly data for each year */
    async function getMonthlyAvgTempByYearFromDataBase(cityYears){
        try{
            var response = await fetch(`${LOCALHOST}/year?city=${encodeURIComponent(cityYears)}`)
            const data = await response.json();
            setYears(data)
            }
        catch(error){
            console.error(error)
            }
        }
    /*function requests region specific cities, sorted by name  */  
    async function getABSortedCities(){
        try{
            var response = alphaOrder? await fetch(`${LOCALHOST}/region?groupBy=City&region=${encodeURIComponent(selectedContinent)}&orderBy=City&order=ASC`)
            : await fetch(`${LOCALHOST}/region?groupBy=City&region=${encodeURIComponent(selectedContinent)}&orderBy=City&order=DESC`)
            const data= await response.json() 
            setCity(data)
            setAlphaOrder(!alphaOrder)
        }
        catch(error){
            console.error(error)
            }
        }
    /*function requests region specific cities, sorted by temperature */   
    async function getTempSortedCities(){
        try{
            var response = tempOrder? await fetch(`${LOCALHOST}/region?groupBy=City&region=${encodeURIComponent(selectedContinent)}&orderBy=AvgTemperature&order=ASC`)
            : await fetch(`${LOCALHOST}/region?groupBy=City&region=${encodeURIComponent(selectedContinent)}&orderBy=AvgTemperature&order=DESC`)
            const data= await response.json() 
            setCity(data)
            setTempOrder(!tempOrder)
        }
        catch(error){
            console.error(error)
            }
        }    
        
    let continents    
    region? continents = region.map(continent=>
    <li onClick={handleClick => {
        /*add to every list element its respective function, that requests region-specific cities
        /*request cities and average temperature */
         getRegionsFromDataBase(continent.Region)
    }} 
    key={continent.Region}>{continent.Region}</li>):continents=""
    
    let cities
    city? cities = city.map(cityName =>
        <div className="YearsElement" key={cityName.City} onClick={handleClick =>{
            /*request monthly average temperature by year of the selected city */
            getMonthlyAvgTempByYearFromDataBase(cityName.City)
            /*display cityname and temperature converted from fahrenheit to celsius */
    }}>{cityName.City} ({((cityName.AvgTemperature-32)/1.8).toFixed(1)}°)</div>):cities= ""
    

    

    return(
        <div>
            <h1>Weather App</h1>
            
            {continents==""?<p>Server not responding</p>:<p>Click on a continent to proceed</p>}
            <div>
                <ul>
                    {continents}
                </ul>
            </div>
            
            <div>
                {cities? <button onClick={getABSortedCities}>Sort Alphabetically</button>:""}
                {cities? <button onClick={getTempSortedCities}>Sort By Temperature</button>:""}
                <div className="YearsList">
                    {cities}
                </div>
            </div>
            
            {/*component only rendered, if year-specific data have been requested */
            years? <Details years={years} LOCALHOST={LOCALHOST}/>:"" }
        </div>
    )
}