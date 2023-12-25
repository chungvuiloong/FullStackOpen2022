const CountryDetails = (country) => {
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

export default CountryDetails;