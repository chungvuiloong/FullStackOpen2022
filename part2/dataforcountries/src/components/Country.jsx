import { useState } from "react";


const Country = ({ filteredCountries }) => {
    const [countryInfo, setCountryInfo] = useState()

    function clickShow (country) {
        return setCountryInfo(country)
    }

    function manyCountries (countries) {
        return <>{countries.name.common}{" "}<button onClick={() => clickShow(countries)}>Show</button></>
    }    
    function oneCountry (country) {
        return (
            <>
                <div>{country?.name?.common}</div>
                <div>Capital: {country?.capital}</div>
                <div>Area: {country?.area}</div>
                <div>
                    <div>Languages</div>
                    <ul>
                        {
                            Object.values(country?.languages).map((language, key) => (
                                <li key={key}>
                                    {language}
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div>
                    <img src={Object.values(country?.flags)[0]} />
                </div>
            </>
        )
    }

    const filterCountriesDiv = filteredCountries?.map((country,i) =>
        <div key={i}>
            {filteredCountries.length === 1 ? oneCountry(country) : manyCountries(country)}
        </div>)

    return (
        <div>
            <div>
                { filteredCountries.length > 10 ? "There are too many matches, try another input" : filterCountriesDiv }
            </div>
            <div>
                { countryInfo && filteredCountries.length > 1 ? oneCountry(countryInfo) : "" }
            </div>
        </div>
    );
};

export default Country;