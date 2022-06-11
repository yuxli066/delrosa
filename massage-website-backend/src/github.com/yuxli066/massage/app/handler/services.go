package handler

import (
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
)

// service constants
const FROMEMAIL string = "paulli@delrosamassage.com"                        // hide this
const PASSWORD string = "DelRosaMassage1962"                                // hide this
const SERVERNAME string = "smtp-relay.gmail.com"                            // servername
const CERTPATH string = "src/github.com/yuxli066/massage/certs/tlsCert.crt" // certpath
const RELAYSERVER string = "smtp-relay.gmail.com:587"

var WORKINGDIR, _ = os.Getwd()

// valid emails to email appointments to
func getValidEmails() []string {
	return []string{"yuxli066@gmail.com"}
}

// API health check
func GetHealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Service is healthy!")
	respondJSON(w, http.StatusOK, map[string]bool{"success": true})
}

// Send appointment email out
func SendEmail(w http.ResponseWriter, r *http.Request) {

	c, err := smtp.Dial(RELAYSERVER)
	if err != nil {
		log.Println(err.Error())
	}
	defer c.Close()

	fmt.Println("Email Sent!")
	respondJSON(w, http.StatusOK, map[string]bool{"Email Sent": true})
}
