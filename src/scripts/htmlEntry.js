// Create function to populate JSON details into HTML format.
const htmlEntry = {

  outputEntry: (entry) => {
    return `
  <div class="dayEntry">
  <h3>${entry.date}</h3>
  <p>Subject matter is... ${entry.title}</p>
  <p>${entry.content}</p>
  <p>Mood for the day: ${entry.mood.label}</p>
  <button class = "btn btn-light btn-sm" id="edit!${entry.id}">Edit</button>
  <button class = "btn btn-light btn-sm" id="delete!${entry.id}">Delete</button>
  </div>
  `
  },

  moodEntry: (entry) => {
    return `
    <option value=${entry.label}>${entry.label}</option>
    `
  }
}

export { htmlEntry }