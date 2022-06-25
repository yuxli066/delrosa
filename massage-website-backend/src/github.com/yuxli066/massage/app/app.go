package app

import (
	"log"
	"net/http"

	"delrosa/src/github.com/yuxli066/massage/app/handler"

	"github.com/gorilla/mux"
)

// App struct holds key app components, such as the api router
type App struct {
	Router       *mux.Router
	ApiRouter    *mux.Router
	StaticRouter *mux.Router
}

// Initialize server application & serve static files
func (a *App) Initialize() {
	a.Router = mux.NewRouter()
	a.ApiRouter = a.Router.PathPrefix("/api/").Subrouter()

	// set api routers
	a.setRouters()

	// set static routers
	a.Router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./massage-website-frontend/public/static/"))))
	a.Router.PathPrefix("/images/").Handler(http.StripPrefix("/images/", http.FileServer(http.Dir("./massage-website-frontend/public/images/"))))
	a.Router.PathPrefix("/page-data/").Handler(http.StripPrefix("/page-data/", http.FileServer(http.Dir("./massage-website-frontend/public/page-data/"))))

	a.Router.PathPrefix("/about/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./massage-website-frontend/public/about/index.html")
	})

	a.Router.PathPrefix("/appointments/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./massage-website-frontend/public/appointments/index.html")
	})

	a.Router.PathPrefix("/contact/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./massage-website-frontend/public/contact/index.html")
	})

	a.Router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./massage-website-frontend/public/index.html")
	})
}

// The setRouters function specifies different backend routes for the api
func (a *App) setRouters() {
	a.Get("/ping", a.handleRequest(handler.GetHealthCheck))
	a.Post("/sendEmail", a.handleRequest(handler.SendEmail))
	a.Get("/checkAvailability", a.handleRequest(handler.CheckAvailability))
}

// HTTP CRUD wrapper function for HTTP GET
func (a *App) Get(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.ApiRouter.HandleFunc(path, f).Methods("GET")
}

// HTTP CRUD wrapper function for HTTP POST
func (a *App) Post(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.ApiRouter.HandleFunc(path, f).Methods("POST")
}

// The Run function runs the api on specified port number
func (a *App) Run(host string) {
	log.Fatal(http.ListenAndServe(host, a.Router))
}

// The RequestHandlerFunction handles incoming http requests
type RequestHandlerFunction func(w http.ResponseWriter, r *http.Request)

// The handleRequest function handles http requests using the defined RequestHandlerFunction above
func (a *App) handleRequest(handler RequestHandlerFunction) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		handler(w, r)
	}
}
