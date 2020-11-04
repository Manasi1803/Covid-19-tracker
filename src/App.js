import React, {useState, useEffect} from 'react';
import './App.css';
import { FormControl, Select, MenuItem, Card, CardContent} from '@material-ui/core';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import {sortData, prettyPrintStat} from "./util.js";
import "leaflet/dist/leaflet.css";
import {Paper, Switch} from '@material-ui/core';
import { createMuiTheme, ThemeProvider} from "@material-ui/core/styles";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [darkMode, setDarkMode] = useState(true);


  const theme = createMuiTheme({
    palette : {
      type: darkMode ? "dark" : "light",
    },
  });


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then(data => {
    setCountryInfo(data);
  });

  }, []);


  useEffect(() => {
    //the code inside here will run once when the component loads and not again
    //async => send a req to the server, wait for it, do something with info
    const getCountriesData = async() => {     //promise inside of async
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())        //rendering only the json
      .then((data) => {
        const countries = data.map((country) => ({    //just to obtain certain info
          name: country.country, //United Kingdom
          value: country.countryInfo.iso2  //UK

        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then(data => {
        setCountry(countryCode);

        //All of the data from the country response

        setCountryInfo(data);
        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  console.log('Countryinfo >>>', countryInfo);
  return (
    <ThemeProvider theme={theme}>
      <Paper style={{height:"100vh"}}>
        <div className={darkMode ? "app darkMode" : "app"}>
          <div className="app__left">
            <div className="app__header">
              <h1>COVID-19 TRACKER</h1>
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}/>
              <FormControl className="app__dropdown">
                <Select variant="outlined" onChange = {onCountryChange} value= {country}>
                {/* Loop through all the coutries and show
                 and show a dropdown list of all the options */}
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {countries.map((country) => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="app__stats">
            {/*InfoBoxes */}
              <InfoBox
              isRed
              active={casesType === "cases"}
              onClick= {(e) => setCasesType('cases')}
              title="Coronavirus Cases"
              total={prettyPrintStat(countryInfo.cases)}
              cases={prettyPrintStat(countryInfo.todayCases)}
              />
              <InfoBox
              active={casesType === "recovered"}
              onClick= {(e) => setCasesType('recovered')}
              title="Recovered"
              total={prettyPrintStat(countryInfo.recovered)}
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              />
              <InfoBox
              isRed
              active={casesType === "deaths"}
              onClick= {(e) => setCasesType('deaths')}
              title="Deaths"
              total={prettyPrintStat(countryInfo.deaths)}
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              />
            </div>
            <Map
              casesType={casesType}
              countries={mapCountries}
              center={mapCenter}
              zoom={mapZoom}/>
          </div>
          <Card className="app__right">
            <CardContent>
              <h2>Live Cases By Country</h2>
              {/* tableData */}
              <Table countries = {tableData}/>
              <h2 className="app__graphTitle">Worldwide new {casesType}</h2>
              {/* Line Graph */}
              <LineGraph className="app__graph" casesType={casesType}/>
            </CardContent>
          </Card>
        </div>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
