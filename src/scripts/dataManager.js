// Code in this file deals with posting and retrieving the data from JSON.

const url = "http://localhost:3000/journalentries?_expand=moods"

const dataManager = {
  getEntries: () => {
    return fetch(`${url}`)
      .then(res => res.json())
      // .then(res => console.log(res))
      // .then(res => res)
  },
  saveEntry: (entry) => {
    return fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    }).then(res => res.json())
  },
  deleteEntry: (id) => {
    return fetch(`${url}/${id}`, {
      method: "DELETE"
    }).then(res => res.json())
  },
  editEntry: (entry, id) => {
    return fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    }).then(res => res.json())
  },
  singleEntry: (id) => {
    return fetch(`${url}/${id}`)
      .then(res => res.json())
  },
  fetchMoods: () => {
    return fetch("http://localhost:3000/mood")
      .then(res => res.json())
      .then(res => res)
  },
  fetchInstructors: () => {
    return fetch("http://localhost:3000/instructors")
      .then(res => res.json())
      .then(res => res)
  }
}

export { dataManager }
