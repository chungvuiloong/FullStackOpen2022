const Country = ({ filteredCountries }) => {
    return (
        <div>
            {
                filteredCountries?.map((country,i) =>
                    <div key={i}>
                        {country.name.common}
                    </div>
            )}
        </div>
    );
};

export default Country;