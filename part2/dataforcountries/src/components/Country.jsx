const Country = ({ filteredCountries }) => {
    function manyCountries (countries) {
        return <>{countries.name.common}</>
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
                    </ul>
                </div>
            </>
        )
    }

    const filterCountriesDiv = filteredCountries?.map((country,i) =>
        <div key={i}>
            {filteredCountries.length === 1 ? oneCountry(country) : manyCountries(country)}
        </div>)



    // if (filteredCountries === 1 ) {

    // }

    return (
        <div>
            { filteredCountries.length > 10 ? "There are too many matches, try another input" : filterCountriesDiv }
        </div>
    );
};

export default Country;