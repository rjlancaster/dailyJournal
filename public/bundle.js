(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataManager = void 0;
// Code in this file deals with posting and retrieving the data from JSON.
const url = "http://localhost:8088/journalentries";
const dataManager = {
  getEntries: () => {
    return fetch(`${url}`).then(res => res.json());
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
  }
};
exports.dataManager = dataManager;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.domRender = void 0;

var _dataManager = require("./dataManager");

var _htmlEntry = require("./htmlEntry");

const dom = entry => {
  document.querySelector("#output").innerHTML += entry;
};

const domRender = () => {
  document.querySelector("#output").innerHTML = "";

  _dataManager.dataManager.getEntries().then(entries => {
    entries.forEach(entry => {
      const entryHtml = (0, _htmlEntry.htmlEntry)(entry);
      dom(entryHtml);
    });
  });
};

exports.domRender = domRender;

},{"./dataManager":1,"./htmlEntry":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.edfJournal = void 0;

var _dataManager = require("./dataManager");

var _domRender = require("./domRender");

var _htmlEntry = require("./htmlEntry");

const edfJournal = {
  editDelete: () => {
    document.querySelector("#output").addEventListener("click", evt => {
      if (evt.target.id.startsWith("delete")) {
        const id = evt.target.id.split("!")[1];

        _dataManager.dataManager.deleteEntry(id).then(() => (0, _domRender.domRender)());
      }

      if (evt.target.id.startsWith("edit")) {
        const id = evt.target.id.split("!")[1]; // console.log(id)

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

            _dataManager.dataManager.getEntries().then(entries => entries.filter(entry => entry.mood === radioBtnClicked)).then(entries => {
              entries.forEach(entry => {
                let entryHtml = (0, _htmlEntry.htmlEntry)(entry);
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

},{"./dataManager":1,"./domRender":2,"./htmlEntry":5}],4:[function(require,module,exports){
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
      <label class="journalInputs" for="mood">Mood for the Day
        <select id="mood">
          <option value="Excited">Excited</option>
          <option value="Good">Good</option>
          <option value="OK">OK</option>
          <option value="Struggling">Struggling</option>
          <option value="Sad">Sad</option>
        </select></label>
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
    const mood = document.querySelector("#mood").value;
    const journalEntryToSave = {
      date: date,
      title: title,
      content: content,
      mood: mood
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
const htmlEntry = entry => {
  return `
<div class="dayEntry">
<h3>${entry.date}</h3>
<p>Subject matter is... ${entry.title}</p>
<p>${entry.content}</p>
<p>Mood for the day: ${entry.mood}</p>
<button class = "btn btn-light btn-sm" id="edit!${entry.id}">Edit</button>
<button class = "btn btn-light btn-sm" id="delete!${entry.id}">Delete</button>
</div>
`;
};

exports.htmlEntry = htmlEntry;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.journal = void 0;

var _formManager = require("./formManager");

var _domRender = require("./domRender");

var _saveJournal = require("./saveJournal");

var _edfJournal = require("./edfJournal");

const journal = () => {
  // inserts input form to #input div in DOM
  document.querySelector("#input").innerHTML = _formManager.formManager.htmlForm(); //loads JSON array to DOM on window load

  (0, _domRender.domRender)(); // function for saveBtn click event, save to JSON, clear output div and reloads JSON array to DOM

  (0, _saveJournal.saveJournal)(); // function for edit and delete buttons

  _edfJournal.edfJournal.editDelete(); // function for mood filter


  _edfJournal.edfJournal.filter();
};

exports.journal = journal;

},{"./domRender":2,"./edfJournal":3,"./formManager":4,"./saveJournal":8}],7:[function(require,module,exports){
"use strict";

var _journal = require("./journal");

// loads journal div to DOM
(0, _journal.journal)();

},{"./journal":6}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveJournal = void 0;

var _dataManager = require("./dataManager");

var _formManager = require("./formManager");

var _domRender = require("./domRender");

const saveJournal = () => {
  document.querySelector("#saveBtn").addEventListener("click", () => {
    const title = document.querySelector("#title").value;
    const content = document.querySelector("#content").value;
    const date = document.querySelector("#date").value;
    const mood = document.querySelector("#mood").value;

    if (!title || !content || !date || !mood) {
      alert("Please fill all entries in form");
    } else {
      _dataManager.dataManager.saveEntry(_formManager.formManager.formatUserInput()).then(() => {
        _formManager.formManager.clearForm();

        (0, _domRender.domRender)();
      });
    }
  });
};

exports.saveJournal = saveJournal;

},{"./dataManager":1,"./domRender":2,"./formManager":4}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGFNYW5hZ2VyLmpzIiwiLi4vc2NyaXB0cy9kb21SZW5kZXIuanMiLCIuLi9zY3JpcHRzL2VkZkpvdXJuYWwuanMiLCIuLi9zY3JpcHRzL2Zvcm1NYW5hZ2VyLmpzIiwiLi4vc2NyaXB0cy9odG1sRW50cnkuanMiLCIuLi9zY3JpcHRzL2pvdXJuYWwuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL3NhdmVKb3VybmFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUE7QUFFQSxNQUFNLEdBQUcsR0FBRyxzQ0FBWjtBQUVBLE1BQU0sV0FBVyxHQUFHO0FBQ2xCLEVBQUEsVUFBVSxFQUFFLE1BQU07QUFDaEIsV0FBTyxLQUFLLENBQUUsR0FBRSxHQUFJLEVBQVIsQ0FBTCxDQUNKLElBREksQ0FDQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUosRUFEUixDQUFQO0FBRUQsR0FKaUI7QUFLbEIsRUFBQSxTQUFTLEVBQUcsS0FBRCxJQUFXO0FBQ3BCLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxFQUFSLEVBQVc7QUFDckIsTUFBQSxNQUFNLEVBQUUsTUFEYTtBQUVyQixNQUFBLE9BQU8sRUFBRTtBQUNQLHdCQUFnQjtBQURULE9BRlk7QUFLckIsTUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQUwsQ0FBZSxLQUFmO0FBTGUsS0FBWCxDQUFMLENBTUosSUFOSSxDQU1DLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSixFQU5SLENBQVA7QUFPRCxHQWJpQjtBQWNsQixFQUFBLFdBQVcsRUFBRyxFQUFELElBQVE7QUFDbkIsV0FBTyxLQUFLLENBQUUsR0FBRSxHQUFJLElBQUcsRUFBRyxFQUFkLEVBQWlCO0FBQzNCLE1BQUEsTUFBTSxFQUFFO0FBRG1CLEtBQWpCLENBQUwsQ0FFSixJQUZJLENBRUMsR0FBRyxJQUFJLEdBQUcs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Iiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBDb2RlIGluIHRoaXMgZmlsZSBkZWFscyB3aXRoIHBvc3RpbmcgYW5kIHJldHJpZXZpbmcgdGhlIGRhdGEgZnJvbSBKU09OLlxuXG5jb25zdCB1cmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9qb3VybmFsZW50cmllc1wiXG5cbmNvbnN0IGRhdGFNYW5hZ2VyID0ge1xuICBnZXRFbnRyaWVzOiAoKSA9PiB7XG4gICAgcmV0dXJuIGZldGNoKGAke3VybH1gKVxuICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gIH0sXG4gIHNhdmVFbnRyeTogKGVudHJ5KSA9PiB7XG4gICAgcmV0dXJuIGZldGNoKGAke3VybH1gLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGVudHJ5KVxuICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gIH0sXG4gIGRlbGV0ZUVudHJ5OiAoaWQpID0+IHtcbiAgICByZXR1cm4gZmV0Y2goYCR7dXJsfS8ke2lkfWAsIHtcbiAgICAgIG1ldGhvZDogXCJERUxFVEVcIlxuICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gIH0sXG4gIGVkaXRFbnRyeTogKGVudHJ5LCBpZCkgPT4ge1xuICAgIHJldHVybiBmZXRjaChgJHt1cmx9LyR7aWR9YCwge1xuICAgICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGVudHJ5KVxuICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gIH0sXG4gIHNpbmdsZUVudHJ5OiAoaWQpID0+IHtcbiAgICByZXR1cm4gZmV0Y2goYCR7dXJsfS8ke2lkfWApXG4gICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcblxuICB9XG59XG5cbmV4cG9ydCB7IGRhdGFNYW5hZ2VyIH1cbiIsImltcG9ydCB7IGRhdGFNYW5hZ2VyIH0gZnJvbSBcIi4vZGF0YU1hbmFnZXJcIlxuaW1wb3J0IHsgaHRtbEVudHJ5IH0gZnJvbSBcIi4vaHRtbEVudHJ5XCJcblxuY29uc3QgZG9tID0gKGVudHJ5KSA9PiB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3V0cHV0XCIpLmlubmVySFRNTCArPSBlbnRyeVxufVxuXG5jb25zdCBkb21SZW5kZXIgPSAoKSA9PiB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3V0cHV0XCIpLmlubmVySFRNTCA9IFwiXCJcbiAgZGF0YU1hbmFnZXIuZ2V0RW50cmllcygpXG4gICAgLnRoZW4oZW50cmllcyA9PiB7XG4gICAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICBjb25zdCBlbnRyeUh0bWwgPSBodG1sRW50cnkoZW50cnkpXG4gICAgICAgIGRvbShlbnRyeUh0bWwpXG4gICAgICB9KVxuICAgIH0pXG59XG5cbmV4cG9ydCB7IGRvbVJlbmRlciB9IiwiaW1wb3J0IHsgZGF0YU1hbmFnZXIgfSBmcm9tIFwiLi9kYXRhTWFuYWdlclwiXG5pbXBvcnQgeyBkb21SZW5kZXIgfSBmcm9tIFwiLi9kb21SZW5kZXJcIlxuaW1wb3J0IHsgaHRtbEVudHJ5IH0gZnJvbSBcIi4vaHRtbEVudHJ5XCJcblxuY29uc3QgZWRmSm91cm5hbCA9IHtcblxuICBlZGl0RGVsZXRlOiAoKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdXRwdXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2dCA9PiB7XG4gICAgICBpZiAoZXZ0LnRhcmdldC5pZC5zdGFydHNXaXRoKFwiZGVsZXRlXCIpKSB7XG4gICAgICAgIGNvbnN0IGlkID0gZXZ0LnRhcmdldC5pZC5zcGxpdChcIiFcIilbMV1cbiAgICAgICAgZGF0YU1hbmFnZXIuZGVsZXRlRW50cnkoaWQpLnRoZW4oKCkgPT4gZG9tUmVuZGVyKCkpXG4gICAgICB9XG4gICAgICBpZiAoZXZ0LnRhcmdldC5pZC5zdGFydHNXaXRoKFwiZWRpdFwiKSkge1xuICAgICAgICBjb25zdCBpZCA9IGV2dC50YXJnZXQuaWQuc3BsaXQoXCIhXCIpWzFdXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlkKVxuICAgICAgICBkYXRhTWFuYWdlci5zaW5nbGVFbnRyeShpZCkudGhlbigoZW50cnkpID0+IHtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RpdGxlXCIpLnZhbHVlID0gZW50cnkudGl0bGVcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIikudmFsdWUgPSBlbnRyeS5jb250ZW50XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkYXRlXCIpLnZhbHVlID0gZW50cnkuZGF0ZVxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9vZFwiKS52YWx1ZSA9IGVudHJ5Lm1vb2RcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIGZpbHRlcjogKCkgPT4ge1xuICAgIGNvbnN0IHJhZGlvQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoXCJtb29kXCIpXG4gICAgcmFkaW9CdG4uZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhZGlvQnRuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHJhZGlvQnRuW2ldLnZhbHVlID09PSBlLnRhcmdldC52YWx1ZSkge1xuICAgICAgICAgICAgbGV0IHJhZGlvQnRuQ2xpY2tlZCA9IHJhZGlvQnRuW2ldLnZhbHVlXG4gICAgICAgICAgICBvdXRwdXQuaW5uZXJIVE1MID0gXCJcIlxuICAgICAgICAgICAgZGF0YU1hbmFnZXIuZ2V0RW50cmllcygpXG4gICAgICAgICAgICAgIC50aGVuKGVudHJpZXMgPT5cbiAgICAgICAgICAgICAgICBlbnRyaWVzLmZpbHRlcihlbnRyeSA9PiBlbnRyeS5tb29kID09PSByYWRpb0J0bkNsaWNrZWQpKVxuICAgICAgICAgICAgICAudGhlbihlbnRyaWVzID0+IHtcbiAgICAgICAgICAgICAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICAgICAgICAgICAgbGV0IGVudHJ5SHRtbCA9IGh0bWxFbnRyeShlbnRyeSlcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3V0cHV0XCIpLmlubmVySFRNTCArPSBlbnRyeUh0bWxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG5leHBvcnQgeyBlZGZKb3VybmFsIH0iLCJjb25zdCBmb3JtTWFuYWdlciA9IHtcbiAgLy8gZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB0byByZXByZXNlbnQgSFRNTCBvbiBtYWluIHBhZ2VcbiAgaHRtbEZvcm06ICgpID0+IHtcbiAgICByZXR1cm4gYFxuICAgIDxkaXYgY2xhc3M9XCJqb3VybmFsXCI+XG4gICAgPGZpZWxkc2V0IGNsYXNzPVwiam91cm5hbEJveFwiPlxuICAgICAgPGxhYmVsIGNsYXNzPVwiam91cm5hbElucHV0c1wiIGZvcj1cImRhdGVcIj5EYXRlIG9mIEVudHJ5XG4gICAgICAgIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIG5hbWU9XCJEYXRlXCIgaWQ9XCJkYXRlXCI+PC9sYWJlbD5cbiAgICAgIDxsYWJlbCBjbGFzcz1cImpvdXJuYWxJbnB1dHNcIiBmb3I9XCJ0aXRsZVwiPkNvbmNlcHQgQ292ZXJlZFxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwidGl0bGVcIiBpZD1cInRpdGxlXCIgcGxhY2Vob2xkZXI9XCJXaGF0IGNvbmNlcHQgYXJlIHlvdSBjb3ZlcmluZyB0b2RheT9cIj48L2xhYmVsPlxuICAgICAgPGxhYmVsIGNsYXNzPVwiam91cm5hbElucHV0c1wiIGZvcj1cImNvbnRlbnRcIj5Kb3VybmFsIEVudHJ5XG4gICAgICAgIDx0ZXh0YXJlYSByb3dzPVwiM1wiIGNvbHVtbnM9XCI0MFwiIG5hbWU9XCJjb250ZW50XCIgaWQ9XCJjb250ZW50XCIgcGxhY2Vob2xkZXI9XCJUZWxsIG1lIHdoYXQncyBvbiB5b3VyIG1pbmRcIj48L3RleHRhcmVhPjwvbGFiZWw+XG4gICAgICA8bGFiZWwgY2xhc3M9XCJqb3VybmFsSW5wdXRzXCIgZm9yPVwibW9vZFwiPk1vb2QgZm9yIHRoZSBEYXlcbiAgICAgICAgPHNlbGVjdCBpZD1cIm1vb2RcIj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiRXhjaXRlZFwiPkV4Y2l0ZWQ8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiR29vZFwiPkdvb2Q8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiT0tcIj5PSzwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJTdHJ1Z2dsaW5nXCI+U3RydWdnbGluZzwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJTYWRcIj5TYWQ8L29wdGlvbj5cbiAgICAgICAgPC9zZWxlY3Q+PC9sYWJlbD5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1saWdodCBidG4tc21cIiBpZD1cInNhdmVCdG5cIj5SZWNvcmQgSm91cm5hbCBFbnRyeTwvYnV0dG9uPlxuICAgICAgPGRpdj5cbiAgICAgICAgPGxlZ2VuZD5GaWx0ZXIgRW50cmllcyBieSBNb29kPC9sZWdlbmQ+XG4gICAgICAgIDxkaXYgaWQ9XCJtb29kRmlsdGVyc1wiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgaWQ9XCJzYWRcIiBuYW1lPVwibW9vZFwiIHZhbHVlPVwiU2FkXCIgLz5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJvbmVcIj5TYWQ8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGlkPVwic3RydWdnbGluZ1wiIG5hbWU9XCJtb29kXCIgdmFsdWU9XCJTdHJ1Z2dsaW5nXCIgLz5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ0d29cIj5TdHJ1Z2dsaW5nPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBpZD1cIm9rXCIgbmFtZT1cIm1vb2RcIiB2YWx1ZT1cIk9LXCIgLz5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ0aHJlZVwiPk9LPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBpZD1cImdvb2RcIiBuYW1lPVwibW9vZFwiIHZhbHVlPVwiR29vZFwiIC8+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiZm91clwiPkdvb2Q8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGlkPVwiZXhjaXRlZFwiIG5hbWU9XCJtb29kXCIgdmFsdWU9XCJFeGNpdGVkXCIgLz5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJmaXZlXCI+RXhjaXRlZDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9maWVsZHNldD5cbiAgPC9kaXY+XG4gICAgYFxuICB9LFxuICAvLyBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHRvIGNsZWFyIHRoZSBmb3JtIGFmdGVyIHNhdmUgY2xpY2tcbiAgY2xlYXJGb3JtOiAoKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0aXRsZVwiKS52YWx1ZSA9IFwiXCJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIikudmFsdWUgPSBcIlwiXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkYXRlXCIpLnZhbHVlID0gXCJcIlxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9vZFwiKS52YWx1ZSA9IFwiXCJcbiAgfSxcblxuICBmb3JtYXRVc2VySW5wdXQ6ICgpID0+IHtcbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGl0bGVcIikudmFsdWVcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpLnZhbHVlXG4gICAgY29uc3QgZGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGF0ZVwiKS52YWx1ZVxuICAgIGNvbnN0IG1vb2QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21vb2RcIikudmFsdWVcbiAgICBjb25zdCBqb3VybmFsRW50cnlUb1NhdmUgPSB7XG4gICAgICBkYXRlOiBkYXRlLFxuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgY29udGVudDogY29udGVudCxcbiAgICAgIG1vb2Q6IG1vb2RcbiAgICB9XG4gICAgcmV0dXJuIGpvdXJuYWxFbnRyeVRvU2F2ZVxuICB9XG59XG5cbmV4cG9ydCB7IGZvcm1NYW5hZ2VyIH0iLCIvLyBDcmVhdGUgZnVuY3Rpb24gdG8gcG9wdWxhdGUgSlNPTiBkZXRhaWxzIGludG8gSFRNTCBmb3JtYXQuXG5jb25zdCBodG1sRW50cnkgPSAoZW50cnkpID0+IHtcbiAgcmV0dXJuIGBcbjxkaXYgY2xhc3M9XCJkYXlFbnRyeVwiPlxuPGgzPiR7ZW50cnkuZGF0ZX08L2gzPlxuPHA+U3ViamVjdCBtYXR0ZXIgaXMuLi4gJHtlbnRyeS50aXRsZX08L3A+XG48cD4ke2VudHJ5LmNvbnRlbnR9PC9wPlxuPHA+TW9vZCBmb3IgdGhlIGRheTogJHtlbnRyeS5tb29kfTwvcD5cbjxidXR0b24gY2xhc3MgPSBcImJ0biBidG4tbGlnaHQgYnRuLXNtXCIgaWQ9XCJlZGl0ISR7ZW50cnkuaWR9XCI+RWRpdDwvYnV0dG9uPlxuPGJ1dHRvbiBjbGFzcyA9IFwiYnRuIGJ0bi1saWdodCBidG4tc21cIiBpZD1cImRlbGV0ZSEke2VudHJ5LmlkfVwiPkRlbGV0ZTwvYnV0dG9uPlxuPC9kaXY+XG5gXG59XG5cbmV4cG9ydCB7IGh0bWxFbnRyeSB9IiwiaW1wb3J0IHsgZm9ybU1hbmFnZXIgfSBmcm9tIFwiLi9mb3JtTWFuYWdlclwiXG5pbXBvcnQgeyBkb21SZW5kZXIgfSBmcm9tIFwiLi9kb21SZW5kZXJcIlxuaW1wb3J0IHsgc2F2ZUpvdXJuYWwgfSBmcm9tIFwiLi9zYXZlSm91cm5hbFwiXG5pbXBvcnQgeyBlZGZKb3VybmFsIH0gZnJvbSBcIi4vZWRmSm91cm5hbFwiXG5cbmNvbnN0IGpvdXJuYWwgPSAoKSA9PiB7XG4gIC8vIGluc2VydHMgaW5wdXQgZm9ybSB0byAjaW5wdXQgZGl2IGluIERPTVxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2lucHV0XCIpLmlubmVySFRNTCA9IGZvcm1NYW5hZ2VyLmh0bWxGb3JtKClcbiAgLy9sb2FkcyBKU09OIGFycmF5IHRvIERPTSBvbiB3aW5kb3cgbG9hZFxuICBkb21SZW5kZXIoKVxuICAvLyBmdW5jdGlvbiBmb3Igc2F2ZUJ0biBjbGljayBldmVudCwgc2F2ZSB0byBKU09OLCBjbGVhciBvdXRwdXQgZGl2IGFuZCByZWxvYWRzIEpTT04gYXJyYXkgdG8gRE9NXG4gIHNhdmVKb3VybmFsKClcbiAgLy8gZnVuY3Rpb24gZm9yIGVkaXQgYW5kIGRlbGV0ZSBidXR0b25zXG4gIGVkZkpvdXJuYWwuZWRpdERlbGV0ZSgpXG4gIC8vIGZ1bmN0aW9uIGZvciBtb29kIGZpbHRlclxuICBlZGZKb3VybmFsLmZpbHRlcigpXG59XG5cblxuZXhwb3J0IHsgam91cm5hbCB9IiwiaW1wb3J0IHsgam91cm5hbCB9IGZyb20gXCIuL2pvdXJuYWxcIlxuXG4vLyBsb2FkcyBqb3VybmFsIGRpdiB0byBET01cbmpvdXJuYWwoKTsiLCJpbXBvcnQgeyBkYXRhTWFuYWdlciB9IGZyb20gXCIuL2RhdGFNYW5hZ2VyXCJcbmltcG9ydCB7IGZvcm1NYW5hZ2VyIH0gZnJvbSBcIi4vZm9ybU1hbmFnZXJcIlxuaW1wb3J0IHsgZG9tUmVuZGVyIH0gZnJvbSBcIi4vZG9tUmVuZGVyXCJcblxuY29uc3Qgc2F2ZUpvdXJuYWwgPSAoKSA9PiB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2F2ZUJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0aXRsZVwiKS52YWx1ZVxuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIikudmFsdWVcbiAgICBjb25zdCBkYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkYXRlXCIpLnZhbHVlXG4gICAgY29uc3QgbW9vZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9vZFwiKS52YWx1ZVxuICAgIGlmICghdGl0bGUgfHwgIWNvbnRlbnQgfHwgIWRhdGUgfHwgIW1vb2QpIHtcbiAgICAgIGFsZXJ0KFwiUGxlYXNlIGZpbGwgYWxsIGVudHJpZXMgaW4gZm9ybVwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhTWFuYWdlci5zYXZlRW50cnkoZm9ybU1hbmFnZXIuZm9ybWF0VXNlcklucHV0KCkpXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICBmb3JtTWFuYWdlci5jbGVhckZvcm0oKVxuICAgICAgICAgIGRvbVJlbmRlcigpXG4gICAgICAgIH0pXG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgeyBzYXZlSm91cm5hbCB9Il19
