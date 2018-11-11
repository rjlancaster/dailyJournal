// Create function to populate JSON details into HTML format.
const htmlEntry = (entry) => {
  return `
<div class="dayEntry">
<h3>${entry.date}</h3>
<p>Subject matter is... ${entry.title}</p>
<p>${entry.content}</p>
<p>Mood for the day: ${entry.mood}</p>
<button class = "btn btn-light btn-sm" id="edit!${entry.id}">Edit</button>
<button class = "btn btn-light btn-sm" id="delete!${entry.id}">Delete</button>
</div>
`
}

export { htmlEntry }