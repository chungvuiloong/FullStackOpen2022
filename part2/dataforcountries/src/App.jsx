import { useEffect, useState } from 'react'
import { getAllCountries } from './services/countryServices'
import Search from './components/Search';
import CountryDetails from './components/CountryDetails';

function App() {
    const [countries, setCountries] = useState([]);
    const [countryInfo, setCountryInfo] = useState()
    const [capitalCountry, setCapitalCountry] = useState()
    const [searchCountry, setSearchCountry] = useState(null);
    const filteredCountries = countries.filter((country) =>
        country?.name?.common?.toLowerCase()
            .includes(searchCountry?.toLowerCase())
    );

    useEffect(() => {
        getAllCountries()
            .then(countriesData => {
            setCountries(countriesData)
        })
    }, [])    

    const searchHandler = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setSearchCountry(value)
        setCountryInfo("")
        setCapitalCountry("")
    }
    
    function clickShow (country) {
        setCountryInfo(country)
        setCapitalCountry(`${country.capital},${country.name.common}`)
    }

    function showAllCountries (countries) {
        return <>{countries.name.common}{" "}<button onClick={() => clickShow(countries)}>Show</button></>
    }    

    const allCountries = filteredCountries?.map((country,i) =>
        <div key={i}>
            { filteredCountries.length === 1 ? <CountryDetails {...country}  /> : showAllCountries(country) }
        </div>
    )

    const tooManyCountries = filteredCountries.length > 10 ?  "There are too many matches, try another input" : allCountries 

  return (
    <>
        <Search searchHandler={searchHandler} />
        { !searchCountry ? <></> : tooManyCountries }

        {
            !countryInfo ? 
                ""
                    : 
                <> 
                    <CountryDetails {...countryInfo} />
                </>
        }
    </>
  )
}

export default App
