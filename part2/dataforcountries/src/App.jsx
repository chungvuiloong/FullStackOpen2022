import { useEffect, useState } from 'react'
import { getAllCountries } from './services/countryServices'
import Search from './components/Search';
import Country from './components/Country';

function App() {
    const [countries, setCountries] = useState([]);
    const [searchCountry, setSearchCountry] = useState(null);

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

    const filteredCountries = countries.filter((country) =>country?.name?.common?.toLowerCase().includes(searchCountry?.toLowerCase())
      );

      console.log(filteredCountries);

  return (
    <>
        <Search searchHandler={searchHandler} />
        <Country filteredCountries={filteredCountries} />
    </>
  )
}

export default App
