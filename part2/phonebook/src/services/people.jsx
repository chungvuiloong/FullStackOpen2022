import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

async function getAll () {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

async function createNewPerson (newPerson) {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

async function updatePerson (currentPerson) {
    const request = axios.post(`${baseUrl}/${currentPerson}`)
    return request.then(response => response.data)
}

async function deletePersonId (personId) {
    const request = axios.delete(`${baseUrl}/${personId}`)
    return request.then(response => response.data)
}

export default { getAll, createNewPerson, updatePerson, deletePersonId }