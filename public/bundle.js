(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataManager = void 0;
// Code in this file deals with posting and retrieving the data from JSON.
const url = "http://localhost:3000/journalentries?_expand=moods";
const dataManager = {
  getEntries: () => {
    return fetch(`${url}`).then(res => res.json()); // .then(res => console.log(res))
    // .then(res => res)
  },
  saveEntry: entry => {
    return fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    }).then(res => res.json());
  },
  deleteEntry: id => {
    return fetch(`${url}/${id}`, {
      method: "DELETE"
    }).then(res => res.json());
  },
  editEntry: (entry, id) => {
    return fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    }).then(res => res.json());
  },
  singleEntry: id => {
    return fetch(`${url}/${id}`).then(res => res.json());
  },
  fetchMoods: () => {
    return fetch("http://localhost:3000/mood").then(res => res.json()).then(res => res);
  },
  fetchInstructors: () => {
    return fetch("http://localhost:3000/instructors").then(res => res.json()).then(res => res);
  }
};
exports.dataManager = dataManager;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dom = void 0;

var _dataManager = require("./dataManager");

var _htmlEntry = require("./htmlEntry");

const dom = {
  domEntries: entry => {
    document.querySelector("#output").innerHTML += entry;
  },
  domMoods: entry => {
    document.querySelector("#moodOptions").innerHTML += entry;
  },
  domInstructor: entry => {
    document.querySelector("#instructorOptions").innerHTML += entry;
  },
  domRender: () => {
    document.querySelector("#output").innerHTML = "";

    _dataManager.dataManager.getEntries().then(entries => {
      entries.forEach(entry => {
        const entryHtml = _htmlEntry.htmlEntry.outputEntry(entry);

        dom.domEntries(entryHtml);
      });
    });
  },
  moodRender: () => {
    _dataManager.dataManager.fetchMoods().then(moods => {
      moods.forEach(mood => {
        const moodHtml = _htmlEntry.htmlEntry.moodEntry(mood);

        dom.domMoods(moodHtml);
      });
    });
  },
  instructorsRender: () => {
    _dataManager.dataManager.fetchInstructors().then(instructors => {
      instructors.forEach(instructor => {
        const instructorHtml = _htmlEntry.htmlEntry.instructorEntry(instructor);

        dom.domInstructor(instructorHtml);
      });
    });
  }
};
exports.dom = dom;

},{"./dataManager":1,"./htmlEntry":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.edfJournal = void 0;

var _dataManager = require("./dataManager");

var _dom = require("./dom");

var _htmlEntry = require("./htmlEntry");

const edfJournal = {
  editDelete: () => {
    document.querySelector("#output").addEventListener("click", evt => {
      if (evt.target.id.startsWith("delete")) {
        const id = evt.target.id.split("!")[1];

        _dataManager.dataManager.deleteEntry(id).then(() => _dom.dom.domRender());
      }

      if (evt.target.id.startsWith("edit")) {
        const id = evt.target.id.split("!")[1];

        _dataManager.dataManager.singleEntry(id).then(entry => {
          document.querySelector("#title").value = entry.title;
          document.querySelector("#content").value = entry.content;
          document.querySelector("#date").value = entry.date;
          document.querySelector("#mood").value = entry.mood;
        });
      }
    });
  },
  filter: () => {
    const radioBtn = document.getElementsByName("mood");
    radioBtn.forEach(button => {
      button.addEventListener("click", e => {
        for (let i = 0; i < radioBtn.length; i++) {
          if (radioBtn[i].value === e.target.value) {
            let radioBtnClicked = radioBtn[i].value;
            output.innerHTML = "";

            _dataManager.dataManager.getEntries().then(entries => entries.filter(entry => entry.mood.label === radioBtnClicked)).then(entries => {
              entries.forEach(entry => {
                let entryHtml = _htmlEntry.htmlEntry.outputEntry(entry);

                document.querySelector("#output").innerHTML += entryHtml;
              });
            });
          }
        }
      });
    });
  }
};
exports.edfJournal = edfJournal;

},{"./dataManager":1,"./dom":2,"./htmlEntry":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formManager = void 0;
const formManager = {
  // function that will be called to represent HTML on main page
  htmlForm: () => {
    return `
    <div class="journal">
    <fieldset class="journalBox">
      <label class="journalInputs" for="date">Date of Entry
        <input type="date" name="Date" id="date"></label>
      <label class="journalInputs" for="title">Concept Covered
        <input type="text" name="title" id="title" placeholder="What concept are you covering today?"></label>
      <label class="journalInputs" for="content">Journal Entry
        <textarea rows="3" columns="40" name="content" id="content" placeholder="Tell me what's on your mind"></textarea></label>
        <label class="journalInputs" for="instructor">Instructor
        <select id="instructorOptions"></select></label>
      <label class="journalInputs" for="mood">Mood for the Day
        <select id="moodOptions"></select></label>
      <button type="button" class="btn btn-light btn-sm" id="saveBtn">Record Journal Entry</button>
      <div>
        <legend>Filter Entries by Mood</legend>
        <div id="moodFilters">
          <div>
            <input type="radio" id="sad" name="mood" value="Sad" />
            <label for="one">Sad</label>
            <input type="radio" id="struggling" name="mood" value="Struggling" />
            <label for="two">Struggling</label>
            <input type="radio" id="ok" name="mood" value="OK" />
            <label for="three">OK</label>
            <input type="radio" id="good" name="mood" value="Good" />
            <label for="four">Good</label>
            <input type="radio" id="excited" name="mood" value="Excited" />
            <label for="five">Excited</label>
          </div>
        </div>
      </div>
    </fieldset>
  </div>
    `;
  },
  // function that will be called to clear the form after save click
  clearForm: () => {
    document.querySelector("#title").value = "";
    document.querySelector("#content").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#mood").value = "";
  },
  formatUserInput: () => {
    const title = document.querySelector("#title").value;
    const content = document.querySelector("#content").value;
    const date = document.querySelector("#date").value;
    const moodID = document.querySelector("#mood").value;
    const journalEntryToSave = {
      date: date,
      title: title,
      content: content,
      moodID: moodID
    };
    return journalEntryToSave;
  }
};
exports.formManager = formManager;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.htmlEntry = void 0;
// Create function to populate JSON details into HTML format.
const htmlEntry = {
  // <p>Mood for the day: ${entry.mood.label}</p>
  // <p>Instructor: ${entry.instructor.firstName}</p>
  outputEntry: entry => {
    return `
  <div class="dayEntry">
  <h3>${entry.date}</h3>
  <p>Subject matter is... ${entry.title}</p>
  <p>${entry.content}</p>
  <button class = "btn btn-light btn-sm" id="edit!${entry.id}">Edit</button>
  <button class = "btn btn-light btn-sm" id="delete!${entry.id}">Delete</button>
  </div>
  `;
  },
  moodEntry: entry => {
    return `
    <option id="mood" value=${entry.id}>${entry.label}</option>
    `;
  },
  instructorEntry: entry => {
    return `
    <option id="instructor" value=${entry.id}>${entry.firstName} ${entry.lastName}</option>
    `;
  }
};
exports.htmlEntry = htmlEntry;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.journal = void 0;

var _formManager = require("./formManager");

var _dom = require("./dom");

var _saveJournal = require("./saveJournal");

var _edfJournal = require("./edfJournal");

const journal = () => {
  // inserts input form to #input div in DOM
  document.querySelector("#input").innerHTML = _formManager.formManager.htmlForm(); //loads JSON array to DOM on window load

  _dom.dom.domRender();

  _dom.dom.moodRender();

  _dom.dom.instructorsRender(); // function for saveBtn click event, save to JSON, clear output div and reloads JSON array to DOM


  (0, _saveJournal.saveJournal)(); // function for edit and delete buttons

  _edfJournal.edfJournal.editDelete(); // function for mood filter


  _edfJournal.edfJournal.filter();
};

exports.journal = journal;

},{"./dom":2,"./edfJournal":3,"./formManager":4,"./saveJournal":8}],7:[function(require,module,exports){
"use strict";

var _journal = require("./journal");

var _dataManager = require("./dataManager");

// loads journal div to DOM
(0, _journal.journal)();

_dataManager.dataManager.getEntries();

},{"./dataManager":1,"./journal":6}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveJournal = void 0;

var _dataManager = require("./dataManager");

var _formManager = require("./formManager");

var _dom = require("./dom");

const saveJournal = () => {
  document.querySelector("#saveBtn").addEventListener("click", () => {
    const title = document.querySelector("#title").value;
    const content = document.querySelector("#content").value;
    const date = document.querySelector("#date").value;
    const moodsID = document.querySelector("#mood").value;
    const instructorsID = document.querySelector("#instructor").value;

    if (!title || !content || !date || !moodsID || !instructorsID) {
      alert("Please fill all entries in form");
    } else {
      _dataManager.dataManager.saveEntry(_formManager.formManager.formatUserInput()).then(() => {
        _formManager.formManager.clearForm();

        _dom.dom.domRender();
      });
    }
  });
};

exports.saveJournal = saveJournal;

},{"./dataManager":1,"./dom":2,"./formManager":4}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGFNYW5hZ2VyLmpzIiwiLi4vc2NyaXB0cy9kb20uanMiLCIuLi9zY3JpcHRzL2VkZkpvdXJuYWwuanMiLCIuLi9zY3JpcHRzL2Zvcm1NYW5hZ2VyLmpzIiwiLi4vc2NyaXB0cy9odG1sRW50cnkuanMiLCIuLi9zY3JpcHRzL2pvdXJuYWwuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL3NhdmVKb3VybmFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUE7QUFFQSxNQUFNLEdBQUcsR0FBRyxvREFBWjtBQUVBLE1BQU0sV0FBVyxHQUFHO0FBQ2xCLEVBQUEsVUFBVSxFQUFFLE1BQU07QUFDaEIsV0FBTyxLQUFLLENBQUUsR0FBRSxHQUFJLEVBQVIsQ0FBTCxDQUNKLElBREksQ0FDQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUosRUFEUixDQUFQLENBRGdCLENBR2Q7QUFDQTtBQUNILEdBTmlCO0FBT2xCLEVBQUEsU0FBUyxFQUFHLEtBQUQsSUFBVztBQUNwQixXQUFPLEtBQUssQ0FBRSxHQUFFLEdBQUksRUFBUixFQUFXO0FBQ3JCLE1BQUEsTUFBTSxFQUFFLE1BRGE7QUFFckIsTUFBQSxPQUFPLEVBQUU7QUFDUCx3QkFBZ0I7QUFEVCxPQUZZO0FBS3JCLE1BQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFMLENBQWUsS0FBZjtBQUxlLEtBQVgsQ0FBTCxDQU1KLElBTkksQ0FNQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUosRUFOUixDQUFQO0FBT0QsR0FmaUI7QUFnQmxCLEVBQUEsV0FBVyxFQUFHLEVBQUQsSUFBUTtBQUNuQixXQUFPLEtBQUssQ0FBRSxHQUFFLEdBQUksSUFBRyxFQUFHLEVBQWQsRUFBaUI7QUFDM0IsTUFBQSxNQUFNLEVBQUU7QUFEbUIsS0FBakIsQ0FBTCxDQUVKLElBRkksQ0FFQyxHQUFH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QUFDQSxVQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixVQUF2QixFQUFtQyxLQUFuRDtBQUNBLFVBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLE9BQXZCLEVBQWdDLEtBQTdDO0FBQ0EsVUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0MsS0FBaEQ7QUFDQSxVQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixhQUF2QixFQUFzQyxLQUE1RDs7QUFDQSxRQUFJLENBQUMsS0FBRCxJQUFVLENBQUMsT0FBWCxJQUFzQixDQUFDLElBQXZCLElBQStCLENBQUMsT0FBaEMsSUFBMkMsQ0FBQyxhQUFoRCxFQUErRDtBQUM3RCxNQUFBLEtBQUssQ0FBQyxpQ0FBRCxDQUFMO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsK0JBQVksU0FBWixDQUFzQix5QkFBWSxlQUFaLEVBQXRCLEVBQ0csSUFESCxDQUNRLE1BQU07QUFDVixpQ0FBWSxTQUFaOztBQUNBLGlCQUFJLFNBQUo7QUFDRCxPQUpIO0FBS0Q7QUFDRixHQWZEO0FBZ0JELENBakJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gQ29kZSBpbiB0aGlzIGZpbGUgZGVhbHMgd2l0aCBwb3N0aW5nIGFuZCByZXRyaWV2aW5nIHRoZSBkYXRhIGZyb20gSlNPTi5cblxuY29uc3QgdXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvam91cm5hbGVudHJpZXM/X2V4cGFuZD1tb29kc1wiXG5cbmNvbnN0IGRhdGFNYW5hZ2VyID0ge1xuICBnZXRFbnRyaWVzOiAoKSA9PiB7XG4gICAgcmV0dXJuIGZldGNoKGAke3VybH1gKVxuICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAvLyAudGhlbihyZXMgPT4gY29uc29sZS5sb2cocmVzKSlcbiAgICAgIC8vIC50aGVuKHJlcyA9PiByZXMpXG4gIH0sXG4gIHNhdmVFbnRyeTogKGVudHJ5KSA9PiB7XG4gICAgcmV0dXJuIGZldGNoKGAke3VybH1gLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGVudHJ5KVxuICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gIH0sXG4gIGRlbGV0ZUVudHJ5OiAoaWQpID0+IHtcbiAgICByZXR1cm4gZmV0Y2goYCR7dXJsfS8ke2lkfWAsIHtcbiAgICAgIG1ldGhvZDogXCJERUxFVEVcIlxuICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gIH0sXG4gIGVkaXRFbnRyeTogKGVudHJ5LCBpZCkgPT4ge1xuICAgIHJldHVybiBmZXRjaChgJHt1cmx9LyR7aWR9YCwge1xuICAgICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGVudHJ5KVxuICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gIH0sXG4gIHNpbmdsZUVudHJ5OiAoaWQpID0+IHtcbiAgICByZXR1cm4gZmV0Y2goYCR7dXJsfS8ke2lkfWApXG4gICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgfSxcbiAgZmV0Y2hNb29kczogKCkgPT4ge1xuICAgIHJldHVybiBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9tb29kXCIpXG4gICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgIC50aGVuKHJlcyA9PiByZXMpXG4gIH0sXG4gIGZldGNoSW5zdHJ1Y3RvcnM6ICgpID0+IHtcbiAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvaW5zdHJ1Y3RvcnNcIilcbiAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgLnRoZW4ocmVzID0+IHJlcylcbiAgfVxufVxuXG5leHBvcnQgeyBkYXRhTWFuYWdlciB9XG4iLCJpbXBvcnQgeyBkYXRhTWFuYWdlciB9IGZyb20gXCIuL2RhdGFNYW5hZ2VyXCJcbmltcG9ydCB7IGh0bWxFbnRyeSB9IGZyb20gXCIuL2h0bWxFbnRyeVwiXG5cbmNvbnN0IGRvbSA9IHtcbiAgZG9tRW50cmllczogKGVudHJ5KSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdXRwdXRcIikuaW5uZXJIVE1MICs9IGVudHJ5XG4gIH0sXG5cbiAgZG9tTW9vZHM6IChlbnRyeSkgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9vZE9wdGlvbnNcIikuaW5uZXJIVE1MICs9IGVudHJ5XG4gIH0sXG4gIGRvbUluc3RydWN0b3I6IChlbnRyeSkgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaW5zdHJ1Y3Rvck9wdGlvbnNcIikuaW5uZXJIVE1MICs9IGVudHJ5XG4gIH0sXG5cbiAgZG9tUmVuZGVyOiAoKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdXRwdXRcIikuaW5uZXJIVE1MID0gXCJcIlxuICAgIGRhdGFNYW5hZ2VyLmdldEVudHJpZXMoKVxuICAgICAgLnRoZW4oZW50cmllcyA9PiB7XG4gICAgICAgIGVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgY29uc3QgZW50cnlIdG1sID0gaHRtbEVudHJ5Lm91dHB1dEVudHJ5KGVudHJ5KVxuICAgICAgICAgIGRvbS5kb21FbnRyaWVzKGVudHJ5SHRtbClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gIH0sXG5cbiAgbW9vZFJlbmRlcjogKCkgPT4ge1xuICAgIGRhdGFNYW5hZ2VyLmZldGNoTW9vZHMoKVxuICAgICAgLnRoZW4obW9vZHMgPT4ge1xuICAgICAgICBtb29kcy5mb3JFYWNoKG1vb2QgPT4ge1xuICAgICAgICAgIGNvbnN0IG1vb2RIdG1sID0gaHRtbEVudHJ5Lm1vb2RFbnRyeShtb29kKVxuICAgICAgICAgIGRvbS5kb21Nb29kcyhtb29kSHRtbClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gIH0sXG4gIGluc3RydWN0b3JzUmVuZGVyOiAoKSA9PiB7XG4gICAgZGF0YU1hbmFnZXIuZmV0Y2hJbnN0cnVjdG9ycygpXG4gICAgICAudGhlbihpbnN0cnVjdG9ycyA9PiB7XG4gICAgICAgIGluc3RydWN0b3JzLmZvckVhY2goaW5zdHJ1Y3RvciA9PiB7XG4gICAgICAgICAgY29uc3QgaW5zdHJ1Y3Rvckh0bWwgPSBodG1sRW50cnkuaW5zdHJ1Y3RvckVudHJ5KGluc3RydWN0b3IpXG4gICAgICAgICAgZG9tLmRvbUluc3RydWN0b3IoaW5zdHJ1Y3Rvckh0bWwpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICB9XG59XG5cbmV4cG9ydCB7IGRvbSB9IiwiaW1wb3J0IHsgZGF0YU1hbmFnZXIgfSBmcm9tIFwiLi9kYXRhTWFuYWdlclwiXG5pbXBvcnQgeyBkb20gfSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IHsgaHRtbEVudHJ5IH0gZnJvbSBcIi4vaHRtbEVudHJ5XCJcblxuY29uc3QgZWRmSm91cm5hbCA9IHtcblxuICBlZGl0RGVsZXRlOiAoKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdXRwdXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2dCA9PiB7XG4gICAgICBpZiAoZXZ0LnRhcmdldC5pZC5zdGFydHNXaXRoKFwiZGVsZXRlXCIpKSB7XG4gICAgICAgIGNvbnN0IGlkID0gZXZ0LnRhcmdldC5pZC5zcGxpdChcIiFcIilbMV1cbiAgICAgICAgZGF0YU1hbmFnZXIuZGVsZXRlRW50cnkoaWQpLnRoZW4oKCkgPT4gZG9tLmRvbVJlbmRlcigpKVxuICAgICAgfVxuICAgICAgaWYgKGV2dC50YXJnZXQuaWQuc3RhcnRzV2l0aChcImVkaXRcIikpIHtcbiAgICAgICAgY29uc3QgaWQgPSBldnQudGFyZ2V0LmlkLnNwbGl0KFwiIVwiKVsxXVxuICAgICAgICBkYXRhTWFuYWdlci5zaW5nbGVFbnRyeShpZCkudGhlbigoZW50cnkpID0+IHtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RpdGxlXCIpLnZhbHVlID0gZW50cnkudGl0bGVcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIikudmFsdWUgPSBlbnRyeS5jb250ZW50XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkYXRlXCIpLnZhbHVlID0gZW50cnkuZGF0ZVxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9vZFwiKS52YWx1ZSA9IGVudHJ5Lm1vb2RcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIGZpbHRlcjogKCkgPT4ge1xuICAgIGNvbnN0IHJhZGlvQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoXCJtb29kXCIpXG4gICAgcmFkaW9CdG4uZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhZGlvQnRuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHJhZGlvQnRuW2ldLnZhbHVlID09PSBlLnRhcmdldC52YWx1ZSkge1xuICAgICAgICAgICAgbGV0IHJhZGlvQnRuQ2xpY2tlZCA9IHJhZGlvQnRuW2ldLnZhbHVlXG4gICAgICAgICAgICBvdXRwdXQuaW5uZXJIVE1MID0gXCJcIlxuICAgICAgICAgICAgZGF0YU1hbmFnZXIuZ2V0RW50cmllcygpXG4gICAgICAgICAgICAgIC50aGVuKGVudHJpZXMgPT5cbiAgICAgICAgICAgICAgICBlbnRyaWVzLmZpbHRlcihlbnRyeSA9PiBlbnRyeS5tb29kLmxhYmVsID09PSByYWRpb0J0bkNsaWNrZWQpKVxuICAgICAgICAgICAgICAudGhlbihlbnRyaWVzID0+IHtcbiAgICAgICAgICAgICAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICAgICAgICAgICAgbGV0IGVudHJ5SHRtbCA9IGh0bWxFbnRyeS5vdXRwdXRFbnRyeShlbnRyeSlcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3V0cHV0XCIpLmlubmVySFRNTCArPSBlbnRyeUh0bWxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCB7IGVkZkpvdXJuYWwgfSIsImNvbnN0IGZvcm1NYW5hZ2VyID0ge1xuICAvLyBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHRvIHJlcHJlc2VudCBIVE1MIG9uIG1haW4gcGFnZVxuICBodG1sRm9ybTogKCkgPT4ge1xuICAgIHJldHVybiBgXG4gICAgPGRpdiBjbGFzcz1cImpvdXJuYWxcIj5cbiAgICA8ZmllbGRzZXQgY2xhc3M9XCJqb3VybmFsQm94XCI+XG4gICAgICA8bGFiZWwgY2xhc3M9XCJqb3VybmFsSW5wdXRzXCIgZm9yPVwiZGF0ZVwiPkRhdGUgb2YgRW50cnlcbiAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgbmFtZT1cIkRhdGVcIiBpZD1cImRhdGVcIj48L2xhYmVsPlxuICAgICAgPGxhYmVsIGNsYXNzPVwiam91cm5hbElucHV0c1wiIGZvcj1cInRpdGxlXCI+Q29uY2VwdCBDb3ZlcmVkXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJ0aXRsZVwiIGlkPVwidGl0bGVcIiBwbGFjZWhvbGRlcj1cIldoYXQgY29uY2VwdCBhcmUgeW91IGNvdmVyaW5nIHRvZGF5P1wiPjwvbGFiZWw+XG4gICAgICA8bGFiZWwgY2xhc3M9XCJqb3VybmFsSW5wdXRzXCIgZm9yPVwiY29udGVudFwiPkpvdXJuYWwgRW50cnlcbiAgICAgICAgPHRleHRhcmVhIHJvd3M9XCIzXCIgY29sdW1ucz1cIjQwXCIgbmFtZT1cImNvbnRlbnRcIiBpZD1cImNvbnRlbnRcIiBwbGFjZWhvbGRlcj1cIlRlbGwgbWUgd2hhdCdzIG9uIHlvdXIgbWluZFwiPjwvdGV4dGFyZWE+PC9sYWJlbD5cbiAgICAgICAgPGxhYmVsIGNsYXNzPVwiam91cm5hbElucHV0c1wiIGZvcj1cImluc3RydWN0b3JcIj5JbnN0cnVjdG9yXG4gICAgICAgIDxzZWxlY3QgaWQ9XCJpbnN0cnVjdG9yT3B0aW9uc1wiPjwvc2VsZWN0PjwvbGFiZWw+XG4gICAgICA8bGFiZWwgY2xhc3M9XCJqb3VybmFsSW5wdXRzXCIgZm9yPVwibW9vZFwiPk1vb2QgZm9yIHRoZSBEYXlcbiAgICAgICAgPHNlbGVjdCBpZD1cIm1vb2RPcHRpb25zXCI+PC9zZWxlY3Q+PC9sYWJlbD5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1saWdodCBidG4tc21cIiBpZD1cInNhdmVCdG5cIj5SZWNvcmQgSm91cm5hbCBFbnRyeTwvYnV0dG9uPlxuICAgICAgPGRpdj5cbiAgICAgICAgPGxlZ2VuZD5GaWx0ZXIgRW50cmllcyBieSBNb29kPC9sZWdlbmQ+XG4gICAgICAgIDxkaXYgaWQ9XCJtb29kRmlsdGVyc1wiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgaWQ9XCJzYWRcIiBuYW1lPVwibW9vZFwiIHZhbHVlPVwiU2FkXCIgLz5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJvbmVcIj5TYWQ8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGlkPVwic3RydWdnbGluZ1wiIG5hbWU9XCJtb29kXCIgdmFsdWU9XCJTdHJ1Z2dsaW5nXCIgLz5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ0d29cIj5TdHJ1Z2dsaW5nPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBpZD1cIm9rXCIgbmFtZT1cIm1vb2RcIiB2YWx1ZT1cIk9LXCIgLz5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ0aHJlZVwiPk9LPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBpZD1cImdvb2RcIiBuYW1lPVwibW9vZFwiIHZhbHVlPVwiR29vZFwiIC8+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiZm91clwiPkdvb2Q8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGlkPVwiZXhjaXRlZFwiIG5hbWU9XCJtb29kXCIgdmFsdWU9XCJFeGNpdGVkXCIgLz5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJmaXZlXCI+RXhjaXRlZDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9maWVsZHNldD5cbiAgPC9kaXY+XG4gICAgYFxuICB9LFxuICAvLyBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHRvIGNsZWFyIHRoZSBmb3JtIGFmdGVyIHNhdmUgY2xpY2tcbiAgY2xlYXJGb3JtOiAoKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0aXRsZVwiKS52YWx1ZSA9IFwiXCJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIikudmFsdWUgPSBcIlwiXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkYXRlXCIpLnZhbHVlID0gXCJcIlxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9vZFwiKS52YWx1ZSA9IFwiXCJcbiAgfSxcblxuICBmb3JtYXRVc2VySW5wdXQ6ICgpID0+IHtcbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGl0bGVcIikudmFsdWVcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpLnZhbHVlXG4gICAgY29uc3QgZGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGF0ZVwiKS52YWx1ZVxuICAgIGNvbnN0IG1vb2RJRCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9vZFwiKS52YWx1ZVxuICAgIGNvbnN0IGpvdXJuYWxFbnRyeVRvU2F2ZSA9IHtcbiAgICAgIGRhdGU6IGRhdGUsXG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICBjb250ZW50OiBjb250ZW50LFxuICAgICAgbW9vZElEOiBtb29kSURcbiAgICB9XG4gICAgcmV0dXJuIGpvdXJuYWxFbnRyeVRvU2F2ZVxuICB9XG59XG5cbmV4cG9ydCB7IGZvcm1NYW5hZ2VyIH0iLCIvLyBDcmVhdGUgZnVuY3Rpb24gdG8gcG9wdWxhdGUgSlNPTiBkZXRhaWxzIGludG8gSFRNTCBmb3JtYXQuXG5jb25zdCBodG1sRW50cnkgPSB7XG5cbiAgLy8gPHA+TW9vZCBmb3IgdGhlIGRheTogJHtlbnRyeS5tb29kLmxhYmVsfTwvcD5cbiAgLy8gPHA+SW5zdHJ1Y3RvcjogJHtlbnRyeS5pbnN0cnVjdG9yLmZpcnN0TmFtZX08L3A+XG4gIG91dHB1dEVudHJ5OiAoZW50cnkpID0+IHtcbiAgICByZXR1cm4gYFxuICA8ZGl2IGNsYXNzPVwiZGF5RW50cnlcIj5cbiAgPGgzPiR7ZW50cnkuZGF0ZX08L2gzPlxuICA8cD5TdWJqZWN0IG1hdHRlciBpcy4uLiAke2VudHJ5LnRpdGxlfTwvcD5cbiAgPHA+JHtlbnRyeS5jb250ZW50fTwvcD5cbiAgPGJ1dHRvbiBjbGFzcyA9IFwiYnRuIGJ0bi1saWdodCBidG4tc21cIiBpZD1cImVkaXQhJHtlbnRyeS5pZH1cIj5FZGl0PC9idXR0b24+XG4gIDxidXR0b24gY2xhc3MgPSBcImJ0biBidG4tbGlnaHQgYnRuLXNtXCIgaWQ9XCJkZWxldGUhJHtlbnRyeS5pZH1cIj5EZWxldGU8L2J1dHRvbj5cbiAgPC9kaXY+XG4gIGBcbiAgfSxcblxuICBtb29kRW50cnk6IChlbnRyeSkgPT4ge1xuICAgIHJldHVybiBgXG4gICAgPG9wdGlvbiBpZD1cIm1vb2RcIiB2YWx1ZT0ke2VudHJ5LmlkfT4ke2VudHJ5LmxhYmVsfTwvb3B0aW9uPlxuICAgIGBcbiAgfSxcbiAgaW5zdHJ1Y3RvckVudHJ5OiAoZW50cnkpID0+IHtcbiAgICByZXR1cm4gYFxuICAgIDxvcHRpb24gaWQ9XCJpbnN0cnVjdG9yXCIgdmFsdWU9JHtlbnRyeS5pZH0+JHtlbnRyeS5maXJzdE5hbWV9ICR7ZW50cnkubGFzdE5hbWV9PC9vcHRpb24+XG4gICAgYFxuICB9XG59XG5cbmV4cG9ydCB7IGh0bWxFbnRyeSB9IiwiaW1wb3J0IHsgZm9ybU1hbmFnZXIgfSBmcm9tIFwiLi9mb3JtTWFuYWdlclwiXG5pbXBvcnQgeyBkb20gfSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IHsgc2F2ZUpvdXJuYWwgfSBmcm9tIFwiLi9zYXZlSm91cm5hbFwiXG5pbXBvcnQgeyBlZGZKb3VybmFsIH0gZnJvbSBcIi4vZWRmSm91cm5hbFwiXG5cbmNvbnN0IGpvdXJuYWwgPSAoKSA9PiB7XG4gIC8vIGluc2VydHMgaW5wdXQgZm9ybSB0byAjaW5wdXQgZGl2IGluIERPTVxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2lucHV0XCIpLmlubmVySFRNTCA9IGZvcm1NYW5hZ2VyLmh0bWxGb3JtKClcbiAgLy9sb2FkcyBKU09OIGFycmF5IHRvIERPTSBvbiB3aW5kb3cgbG9hZFxuICBkb20uZG9tUmVuZGVyKClcbiAgZG9tLm1vb2RSZW5kZXIoKVxuICBkb20uaW5zdHJ1Y3RvcnNSZW5kZXIoKVxuICAvLyBmdW5jdGlvbiBmb3Igc2F2ZUJ0biBjbGljayBldmVudCwgc2F2ZSB0byBKU09OLCBjbGVhciBvdXRwdXQgZGl2IGFuZCByZWxvYWRzIEpTT04gYXJyYXkgdG8gRE9NXG4gIHNhdmVKb3VybmFsKClcbiAgLy8gZnVuY3Rpb24gZm9yIGVkaXQgYW5kIGRlbGV0ZSBidXR0b25zXG4gIGVkZkpvdXJuYWwuZWRpdERlbGV0ZSgpXG4gIC8vIGZ1bmN0aW9uIGZvciBtb29kIGZpbHRlclxuICBlZGZKb3VybmFsLmZpbHRlcigpXG5cbn1cblxuXG5leHBvcnQgeyBqb3VybmFsIH0iLCJpbXBvcnQgeyBqb3VybmFsIH0gZnJvbSBcIi4vam91cm5hbFwiXG5pbXBvcnQgeyBkYXRhTWFuYWdlciB9IGZyb20gXCIuL2RhdGFNYW5hZ2VyXCJcbi8vIGxvYWRzIGpvdXJuYWwgZGl2IHRvIERPTVxuam91cm5hbCgpO1xuXG5kYXRhTWFuYWdlci5nZXRFbnRyaWVzKCkiLCJpbXBvcnQgeyBkYXRhTWFuYWdlciB9IGZyb20gXCIuL2RhdGFNYW5hZ2VyXCJcbmltcG9ydCB7IGZvcm1NYW5hZ2VyIH0gZnJvbSBcIi4vZm9ybU1hbmFnZXJcIlxuaW1wb3J0IHsgZG9tIH0gZnJvbSBcIi4vZG9tXCJcblxuY29uc3Qgc2F2ZUpvdXJuYWwgPSAoKSA9PiB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2F2ZUJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0aXRsZVwiKS52YWx1ZVxuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIikudmFsdWVcbiAgICBjb25zdCBkYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkYXRlXCIpLnZhbHVlXG4gICAgY29uc3QgbW9vZHNJRCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9vZFwiKS52YWx1ZVxuICAgIGNvbnN0IGluc3RydWN0b3JzSUQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2luc3RydWN0b3JcIikudmFsdWVcbiAgICBpZiAoIXRpdGxlIHx8ICFjb250ZW50IHx8ICFkYXRlIHx8ICFtb29kc0lEIHx8ICFpbnN0cnVjdG9yc0lEKSB7XG4gICAgICBhbGVydChcIlBsZWFzZSBmaWxsIGFsbCBlbnRyaWVzIGluIGZvcm1cIilcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YU1hbmFnZXIuc2F2ZUVudHJ5KGZvcm1NYW5hZ2VyLmZvcm1hdFVzZXJJbnB1dCgpKVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgZm9ybU1hbmFnZXIuY2xlYXJGb3JtKClcbiAgICAgICAgICBkb20uZG9tUmVuZGVyKClcbiAgICAgICAgfSlcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCB7IHNhdmVKb3VybmFsIH0iXX0=
