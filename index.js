import express from "express";
import Database from "better-sqlite3";

const app = express();
const dbOptions = {};
const db = new Database("foobar.db", dbOptions);
const PORT = 3100
db.pragma("journal_mode = WAL");


/*to check if server is running */
app.get("/", function (req, res) {
  	try{
		res.send("Up and running")
	}

	/*try/error-catch can be implemented and individualized for each different request */
	catch{
		console.error("something happened")
	}
})
/*responds with all valid continents*/
/* responds to getRegionsFromDataBase */
app.get("/dbinfo/continents", (req,res)=>{
	const row = db.prepare(`SELECT DISTINCT region from city_temperature`).all()
	res.json(row)
})
/*responds with a list of years for which data exists for a given city  */
/*responds to  getMonthlyAvgTempByYearFromDataBase*/
app.get("/dbinfo/year", (req,res) => {
	const row = db.prepare(`SELECT City, AVG(AvgTemperature) AS AvgTemperature, Year, Region FROM (
		SELECT City, AvgTemperature, Year, Month, Region FROM city_temperature WHERE city=? AND AvgTemperature <> -99) GROUP BY Year, City`).all(`${req.query.city}`)
	res.json(row)
})
/*----------------------------------------------------------------------------------------------- */
/*responds with region specific cities and their respective average temperature, grouped and ordered */
/*responds to  getABSortedCities and getTempSortedCities */
app.get("/dbinfo/region", (req,res)=>{
	const row = db.prepare(`SELECT City, AVG(AvgTemperature)as AvgTemperature from city_temperature WHERE region=? AND AvgTemperature <> -99 GROUP BY ${req.query.groupBy} ORDER BY ${req.query.orderBy} ${req.query.order}`).all(`${req.query.region}`)
	res.json(row)
})
/*-------------------------------------------------------------------------------------------------- */


/*requests year-specific data eg avgtemperature for the selected city */
/* responds to getYearSpecificData*/
app.get("/dbinfo/city", (req, res) => {
	const row = db.prepare(`SELECT City, AVG(AvgTemperature) as AvgTemperature, Month, Year FROM (SELECT City, AvgTemperature, 
		Month, Year FROM city_temperature WHERE AvgTemperature <> -99 AND city = ? AND year = ?) GROUP BY Month, City`).all(`${req.query.city}`,`${req.query.year}`);
	res.json(row)
});

/*requests month specific data for every month for the selected city and year*/
/*responds to getYearSpecificData */
app.get("/dbinfo/months", (req, res) => {
	const row = db.prepare(`SELECT City, AVG(AvgTemperature) as AvgTemperature, Month, Year FROM (SELECT City, AvgTemperature, 
		Month, Year FROM city_temperature WHERE AvgTemperature <> -99 AND city = ? AND year = ?) GROUP BY Month, City`).all(`${req.query.city}`,`${req.query.year}`);
	res.json(row)
});



/*requests daily data of a single month given selected city, year and month*/
/*responds to getDailyData */
app.get("/dbinfo/day", (req, res)=> {
	const row = db.prepare(`SELECT City, Day, Month, AvgTemperature, Year from city_temperature WHERE AvgTemperature <> -99
	 AND city = ? AND year = ? AND month = ?`).all(`${req.query.city}`,`${req.query.year}`,`${req.query.month}`)
	 res.json(row)
})

/*requests year-specific seasonal data for the respective city  */
/*responds to getSeasonSpecificData */
app.get("/dbinfo/season", (req,res)=>{
	const row = db.prepare(`SELECT City, Day as Days, Month, AvgTemperature, ROW_NUMBER() OVER (ORDER BY Month, cast(DAY as int)) AS Day from city_temperature WHERE city = ? AND year = ? AND AvgTemperature <> -99 and month between ${req.query.start} and ${req.query.end}`).all(`${req.query.city}`,`${req.query.year}`)
	res.json(row)
	
})

app.listen(PORT)
