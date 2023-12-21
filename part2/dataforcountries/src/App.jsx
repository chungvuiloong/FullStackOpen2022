import { useEffect, useState } from 'react'
import { getAllCountries } from './services/countryServices'

function App() {
    const [countries, setCountries] = useState();

    useEffect(() => {
        getAllCountries()
        .then(countries => {
        setCountries(countries)
        })
    }, [])

  return (
    <>

    </>
  )
}

export default App
