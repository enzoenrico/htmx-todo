package server

import (
	"net/http"
	"text/template"
	"time"
)

type Todos struct {
	Todo        string
	Description string
	Created     time.Time
}

	var data map[string][]Todos = map[string][]Todos{
		"Data":{
			Todos{
				Todo: "Lorem",
				Description: "Ipsum",
				Created: time.Time{},
			},
		},
	}

// The Serve function sets up a route for the "/" path to call the greet function and starts a server
// listening on port 8080.
func Serve() {
	http.HandleFunc("/", greet)
	http.HandleFunc("/api/newentry", newentry)
	http.ListenAndServe(":8080", nil)
}


func greet(w http.ResponseWriter, r *http.Request) {
	// fmt.Fprintf(w, "Hello World")
	tmpl := template.Must(template.ParseFiles("templates/index.html"))
	tmpl.Execute(w, data)
}

// The `newentry` function creates a new entry in a list of todos based on the POST request data.
func newentry(w http.ResponseWriter, r *http.Request) {
	var res Todos = Todos{
		Todo: r.PostFormValue("title"),
		Description: r.PostFormValue("description"),
		Created: time.Now(),
	}

	data["Data"] = append(data["Data"], res)
}
