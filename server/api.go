package server

import (
	"fmt"
	"net/http"
	"time"
)

type Todos struct {
	Todo        string
	Description string
	Created     time.Time
}

var todos []Todos

// The Serve function sets up a route for the "/" path to call the greet function and starts a server
// listening on port 8080.
func Serve() {
	http.HandleFunc("/", greet)
	http.ListenAndServe(":8080", nil)
}


func greet(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World")
}
