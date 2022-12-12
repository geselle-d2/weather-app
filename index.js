import express from "express";
import Database from "better-sqlite3";

const app = express();
const dbOptions = {};
const db = new Database("foobar.db", dbOptions);
db.pragma("journal_mode = WAL");

// A basic get route, accessible from anywhere
app.get("/", function (req, res) {
  	res.send("Hello World");
});
/*responds with all valid continents*/
app.get("/dbinfo/continents", (req,res)=>{
	const row = db.prepare(`SELECT DISTINCT region from city_temperature`).all()
	res.json(row)
})
/*responds with a list of years for which data exists for a given city  */
app.get("/dbinfo/year/:city", (req,res) => {
	const row = db.prepare(`SELECT City, AVG(AvgTemperature) AS AvgTemperature, Year, Region FROM (
		SELECT City, AvgTemperature, Year, Month, Region FROM city_temperature WHERE city='${req.params.city}' AND AvgTemperature <> -99) GROUP BY Year, City`).all()
	res.json(row)
})
/*responds with city specific data*/
app.get("/dbinfo/:city/city", (req, res) => {
	const row = db.prepare(`SELECT * from city_temperature where city = '${req.params.city}'`).all();
	res.json(row)
})
/*responds with all distinct cities for the selected region */
app.get("/dbinfo/region/:region", (req,res)=>{
	const row = db.prepare(`SELECT City, AVG(AvgTemperature)as AvgTemperature from city_temperature WHERE region='${req.params.region}' AND AvgTemperature <> -99 GROUP BY City`).all()
	res.json(row)
})
app.get("/dbinfo/region/:region/desc", (req,res)=>{
	const row = db.prepare(`SELECT City, AVG(AvgTemperature)as AvgTemperature from city_temperature WHERE region='${req.params.region}' AND AvgTemperature <> -99 GROUP BY City ORDER BY City DESC`).all()
	res.json(row)
})
/* responds with all unique cities and their average temperature sorted in ascending order */
app.get("/dbinfo/tempasc/:region/", (req, res)=> {
	const row = db.prepare(`SELECT City, AVG(AvgTemperature)as AvgTemperature from city_temperature WHERE region='${req.params.region}' AND AvgTemperature <> -99 GROUP BY City ORDER BY AvgTemperature ASC`).all()
	res.json(row)
})
/* responds with all unique cities and their average temperature sorted in descending order */
app.get("/dbinfo/tempdesc/:region/", (req, res)=> {
	const row = db.prepare(`SELECT City, AVG(AvgTemperature) as AvgTemperature from city_temperature WHERE region='${req.params.region}' AND AvgTemperature <> -99 GROUP BY City ORDER BY AvgTemperature DESC`).all()
	res.json(row)
})
/* city-specific avg-temperature requests*/
app.get("/dbinfo/:city/AvgTemp", (req,res)=> {
	const row = db.prepare(`select AVG(AvgTemperature) as ${req.params.city}Temp from city_temperature where city ='${req.params.city}'`).all();
	res.json(row)
})
/*you are here--------------------------------- */
app.get("/dbinfo/:year/:city/", (req,res)=>{
	const row = db.prepare(`SELECT * from city_temperature WHERE city = '${req.params.city}' AND year = '${req.params.year}'`).all();
	res.json(row)
})



/*requests year-specific data eg avgtemperature for the selected city */
app.get("/dbinfo/city/:city/:year", (req, res) => {
	const row = db.prepare(`SELECT City, AVG(AvgTemperature) as AvgTemperature, Month, Year FROM (SELECT City, AvgTemperature, 
		Month, Year FROM city_temperature WHERE AvgTemperature <> -99 AND city = '${req.params.city}' AND year = '${req.params.year}') GROUP BY Month, City`).all();
	res.json(row)
});
/*requests year specific data, temperature averaged over the whole year */
app.get("/dbinfo/city/:city/:year/overall", (req, res) => {
	const row = db.prepare(`SELECT City, AVG(AvgTemperature) as AvgTemperature, Year FROM (SELECT City, AvgTemperature, 
		Year FROM city_temperature WHERE AvgTemperature <> -99 AND city = '${req.params.city}' AND year = '${req.params.year}') GROUP BY City`).all();
	res.json(row)
});
/*requests month-specific data for the selected city and year */
app.get("/dbinfo/city/:city/:year/:month", (req, res) => {
	const row = db.prepare(`SELECT City, AVG(AvgTemperature) as AvgTemperature, Month, Year FROM (SELECT City, AvgTemperature, 
		Month, Year FROM city_temperature WHERE AvgTemperature <> -99 AND city = '${req.params.city}' AND year = '${req.params.year}' AND Month ='${req.params.month}') GROUP BY Month, City`).all();
	res.json(row)
});

/*requests year-specific seasonal data for the respective city  */
app.get("/dbinfo/city/:city/:year/Spring", (req, res) => {
	const row = db.prepare(`SELECT * from city_temperature WHERE city = '${req.params.city}' AND year = '${req.params.year}' and month between 3 and 6`).all();
	res.json(row)
});
app.get("/dbinfo/city/:city/:year/Summer", (req, res) => {
	const row = db.prepare(`SELECT * from city_temperature WHERE city = '${req.params.city}' AND year = '${req.params.year}' and month between 6 and 9`).all();
	res.json(row)
});

app.get("/dbinfo/city/:city/:year/Fall", (req, res) => {
	const row = db.prepare(`SELECT * from city_temperature WHERE city = '${req.params.city}' AND year = '${req.params.year}' and month between 9 and 12`).all();
	res.json(row)
});

app.get("/dbinfo/city/:city/:year/Winter", (req, res) => {
	const row = db.prepare(`SELECT * from city_temperature WHERE city = '${req.params.city}' AND year = '${req.params.year}' and month between 0 and 3`).all();
	res.json(row)
});


app.listen(3100)