import { useEffect, useState } from 'react'
import { getAllCountries } from './services/countryServices'
import Search from './components/Search';

function App() {
    const [countries, setCountries] = useState();
    const [searchCountry, setSearchCountry] = useState();

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
        console.log(value);
    }


  return (
    <>
        <Search searchHandler={searchHandler} />
        <div>
            {
                countries?.map((country, i) => 
                    <div key={i}>
                        {country.name.common}
                    </div>
            )}
        </div>
    </>
  )
}

export default App
