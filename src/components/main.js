import React from "react"
import Details from "./details"
export default function (){


    const [region, setRegion] = React.useState([]);
    const [city, setCity] = React.useState([])
    const [years, setYears] = React.useState()
    const [alphaOrder, setAlphaOrder] = React.useState(true)
    const [tempOrder, setTempOrder] = React.useState(true)
    const [selectedContinent, setSelectedContinent] = React.useState()
    
    React.useEffect(function(){
        fetch("http://localhost:3100/dbinfo/continents")
            .then(response => response.json())
            .then(data =>setRegion(data));
    },[])
    
    /*map the received regions to their respective list element */
    let continents = region.map(continent=>
    <li onClick={handleClick => {
        /*add to every list element its respective function, that requests region-specific cities */
        async function getRegionsFromDataBase(){
            var response = await fetch(`http://localhost:3100/dbinfo/region/${continent.Region}`)
            const data= await response.json() 
            setCity(data)
            setSelectedContinent(continent.Region)
        }
        getRegionsFromDataBase()
    }} 
    id={continent.Region}>{continent.Region}</li>)
    
    let cities = city.map(cityName =>
        <div className="YearsElement" onClick={handleClick =>{
            /*request avgtemp by year of the selected city */
            
            async function getCityYearsFromDataBase(){
                var response2 = await fetch(`http://localhost:3100/dbinfo/year/${cityName.City}`)
                const data2 = await response2.json();
                setYears(data2)
            }
            
            getCityYearsFromDataBase()


            /*display cityname and temperature converted from fahrenheit to celsius */
    }}>{cityName.City} ({((cityName.AvgTemperature-32)/1.8).toFixed(1)}°)</div>)
    
    return(
        <div>
            <h1>Weather App</h1>
            <div>
                <input></input>
                <button>Search</button>
            </div>
            <div>
                <ul>
                    {continents}
                </ul>
            </div>
            <div>
                <button onClick={handleClick=>{
                    /*request data from database. alphaorder and temporder track if list is to reversed or not by sending a new request */
                    async function getRegionsFromDataBase(){
                        var response = alphaOrder? await fetch(`http://localhost:3100/dbinfo/region/${selectedContinent}`)
                        : await fetch(`http://localhost:3100/dbinfo/region/${selectedContinent}/desc`)
                        const data= await response.json() 
                        setCity(data)
                        setAlphaOrder(!alphaOrder)
                    }
                    getRegionsFromDataBase()
                }}>Sort Alphabetically</button>
                <button onClick={handleClick=> {
                    async function getRegionsFromDataBase(){
                        var response = tempOrder? await fetch(`http://localhost:3100/dbinfo/tempasc/${selectedContinent}`)
                        : await fetch(`http://localhost:3100/dbinfo/tempdesc/${selectedContinent}`)
                        const data= await response.json() 
                        setCity(data)
                        setTempOrder(!tempOrder)
                    }
                    getRegionsFromDataBase()
                }}>Sort By Temperature</button>
                <div className="YearsList">
                    {cities}
                </div>
            </div>
            
            {years? <Details years={years}/>:""}
        </div>
    )
}