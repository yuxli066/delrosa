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
		SERVERNAME: "smtp.gmail.com",
		SERVERPORT: 587,
		FROMEMAIL:  "paulli@delrosamassage.com",
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

	json.Unmarshal([]byte(b), &emailClient.EMAIL)

	emailClient.Execute()
	fmt.Println("Email Sent!")
	respondJSON(w, http.StatusOK, map[string]bool{"Email Sent": true})
}

// check for appointment availability using Google's Calendar API
func GetAvailability(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	var c calendarClient.GoogleCalendar = calendarClient.GoogleCalendar{
		CTX:            ctx,
		USEREMAIL:      "paulli@delrosamassage.com",
		CONFIGFILEPATH: "./src/github.com/yuxli066/massage/certs/massage-calendar.json",
		SCOPE:          calendar.CalendarScope,
	}
	c.Authenticate()
	timesBusy := c.GetAvailability()
	respondJSON(w, http.StatusOK, timesBusy)
}

func SetNewAppointment(w http.ResponseWriter, r *http.Request) {

	type appointmentTimes struct {
		INTIME  string
		OUTTIME string
		DETAILS *calendarClient.AppointmentDetails
	}

	t, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading body: %v", err)
		respondError(w, http.StatusBadRequest, "Cannot read request body")
		return
	}

	var at appointmentTimes
	json.Unmarshal([]byte(t), &at)

	ctx := context.Background()
	var c calendarClient.GoogleCalendar = calendarClient.GoogleCalendar{
		CTX:            ctx,
		USEREMAIL:      "paulli@delrosamassage.com",
		CONFIGFILEPATH: "src/github.com/yuxli066/massage/certs/massage-calendar.json",
		SCOPE:          calendar.CalendarScope,
	}

	c.Authenticate()
	c.SetAppointment(at.INTIME, at.OUTTIME, at.DETAILS)
	respondJSON(w, http.StatusOK, map[string]bool{"Appointment Set": true})
}
