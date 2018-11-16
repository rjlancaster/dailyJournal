// Create function to populate JSON details into HTML format.
const htmlEntry = {

  // <p>Mood for the day: ${entry.mood.label}</p>
  // <p>Instructor: ${entry.instructor.firstName}</p>
  outputEntry: (entry) => {
    return `
  <div class="dayEntry">
  <h3>${entry.date}</h3>
  <p>Subject matter is... ${entry.title}</p>
  <p>${entry.content}</p>
  <button class = "btn btn-light btn-sm" id="edit!${entry.id}">Edit</button>
  <button class = "btn btn-light btn-sm" id="delete!${entry.id}">Delete</button>
  </div>
  `
  },

  moodEntry: (entry) => {
    return `
    <option id="mood" value=${entry.id}>${entry.label}</option>
    `
  },
  instructorEntry: (entry) => {
    return `
    <option id="instructor" value=${entry.id}>${entry.firstName} ${entry.lastName}</option>
    `
  }
}

export { htmlEntry }