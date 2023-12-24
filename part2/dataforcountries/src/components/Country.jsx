const Country = ({ filteredCountries, setCountryInfo, setCapitalCountry }) => {

    function clickShow (country) {
        setCountryInfo(country)
        setCapitalCountry(`${country.capital},${country.name.common}`)
    }

    function showAllCountries (countries) {
        return <>{countries.name.common}{" "}<button onClick={() => clickShow(countries)}>Show</button></>
    }    

    const filterCountriesDiv = filteredCountries?.map((country,i) =>
        <div key={i}>
            {filteredCountries.length === 1 ? <>Test</> : showAllCountries(country)}
        </div>)

    return filteredCountries.length > 10 ? "There are too many matches, try another input" : filterCountriesDiv
};

export default Country;