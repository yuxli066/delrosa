package handler

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/smtp"

	"delrosa/src/github.com/yuxli066/massage/app/email"
)

var emailClient email.Email = email.Email{
	CERTPATH:   "src/github.com/yuxli066/massage/certs/tlsCert.crt",
	SERVERNAME: "smtp-relay.gmail.com",
	SERVERPORT: 587,
	FROMEMAIL:  "paulli@delrosamassage.com",
	TOEMAILS:   []string{"yuxli066@gmail.com"},
}

// API health check
func GetHealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Service is healthy!")
	respondJSON(w, http.StatusOK, map[string]bool{"success": true})
}

// Send appointment email out
func SendEmail(w http.ResponseWriter, r *http.Request) {
	var err error
	emailClient.SERVER, err = smtp.Dial(emailClient.GetServerUrl())
	if err != nil {
		log.Println(err.Error())
	}
	defer emailClient.SERVER.Close()

	b, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	log.Println(b)

	emailClient.Execute()
	fmt.Println("Email Sent!")
	respondJSON(w, http.StatusOK, map[string]bool{"Email Sent": true})
}
