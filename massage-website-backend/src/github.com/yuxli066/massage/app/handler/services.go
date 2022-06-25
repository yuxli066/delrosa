package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/smtp"

	calendarClient "delrosa/src/github.com/yuxli066/massage/app/calendar"
	"delrosa/src/github.com/yuxli066/massage/app/email"

	"google.golang.org/api/calendar/v3"
)

// API health check
func GetHealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Service is healthy!")
	respondJSON(w, http.StatusOK, map[string]bool{"success": true})
}

// Send appointment email out
func SendEmail(w http.ResponseWriter, r *http.Request) {

	var emailClient email.Email = email.Email{
		CERTPATH:   "src/github.com/yuxli066/massage/certs/tlsCert.crt",
		SERVERNAME: "smtp-relay.gmail.com",
		SERVERPORT: 587,
		FROMEMAIL:  "paulli@delrosamassage.com",
		TOEMAIL:    "yuxli066@gmail.com",
	}

	var err error
	emailClient.SERVER, err = smtp.Dial(emailClient.GetServerUrl())
	if err != nil {
		log.Println(err.Error())
	}
	defer emailClient.SERVER.Close()

	b, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading body: %v", err)
		respondError(w, http.StatusBadRequest, "Cannot read request body")
		return
	}

	json.Unmarshal([]byte(b), &emailClient.EMAILBODY)

	emailClient.Execute()
	fmt.Println("Email Sent!")
	respondJSON(w, http.StatusOK, map[string]bool{"Email Sent": true})
}

// check for appointment availability using Google's Calendar API
func CheckAvailability(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	var c calendarClient.GoogleCalendar = calendarClient.GoogleCalendar{
		CTX:            ctx,
		USEREMAIL:      "paulli@delrosamassage.com",
		CONFIGFILEPATH: "src/github.com/yuxli066/massage/certs/massage-calendar.json",
		SCOPE:          calendar.CalendarScope,
	}
	c.Authenticate()
	c.GetAppointments()
	respondJSON(w, http.StatusOK, map[string]bool{"Calendar API": true})
}
